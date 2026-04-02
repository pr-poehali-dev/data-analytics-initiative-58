"""
API для работы со статьями блога «Тихое присутствие».
Поддерживает получение списка, отдельной статьи, создание, редактирование и удаление.
"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN", "")

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token",
}


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def is_admin(event):
    headers = event.get("headers") or {}
    token = headers.get("X-Admin-Token") or headers.get("x-admin-token") or ""
    return token == ADMIN_TOKEN and ADMIN_TOKEN != ""


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    article_id = params.get("id")

    conn = get_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    try:
        # GET — список или одна статья
        if method == "GET":
            if article_id:
                cur.execute(
                    "SELECT * FROM articles WHERE id = %s AND published = true",
                    (article_id,)
                )
                article = cur.fetchone()
                if not article:
                    return {"statusCode": 404, "headers": CORS_HEADERS, "body": json.dumps({"error": "Статья не найдена"})}
                return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps(dict(article), default=str)}
            else:
                admin = is_admin(event)
                if admin:
                    cur.execute("SELECT * FROM articles ORDER BY created_at DESC")
                else:
                    cur.execute("SELECT * FROM articles WHERE published = true ORDER BY created_at DESC")
                articles = [dict(r) for r in cur.fetchall()]
                return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps(articles, default=str)}

        # POST — создать статью (только админ)
        if method == "POST":
            if not is_admin(event):
                return {"statusCode": 403, "headers": CORS_HEADERS, "body": json.dumps({"error": "Нет доступа"})}
            body = json.loads(event.get("body") or "{}")
            cur.execute(
                """INSERT INTO articles (tag, title, excerpt, content, read_time, published)
                   VALUES (%s, %s, %s, %s, %s, %s) RETURNING *""",
                (body["tag"], body["title"], body["excerpt"], body["content"],
                 body.get("read_time", "5 мин"), body.get("published", True))
            )
            conn.commit()
            article = dict(cur.fetchone())
            return {"statusCode": 201, "headers": CORS_HEADERS, "body": json.dumps(article, default=str)}

        # PUT — обновить статью (только админ)
        if method == "PUT":
            if not is_admin(event):
                return {"statusCode": 403, "headers": CORS_HEADERS, "body": json.dumps({"error": "Нет доступа"})}
            body = json.loads(event.get("body") or "{}")
            cur.execute(
                """UPDATE articles SET tag=%s, title=%s, excerpt=%s, content=%s,
                   read_time=%s, published=%s, updated_at=NOW()
                   WHERE id=%s RETURNING *""",
                (body["tag"], body["title"], body["excerpt"], body["content"],
                 body.get("read_time", "5 мин"), body.get("published", True), article_id)
            )
            conn.commit()
            article = cur.fetchone()
            if not article:
                return {"statusCode": 404, "headers": CORS_HEADERS, "body": json.dumps({"error": "Статья не найдена"})}
            return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps(dict(article), default=str)}

        # DELETE — удалить статью (только админ)
        if method == "DELETE":
            if not is_admin(event):
                return {"statusCode": 403, "headers": CORS_HEADERS, "body": json.dumps({"error": "Нет доступа"})}
            cur.execute("DELETE FROM articles WHERE id = %s", (article_id,))
            conn.commit()
            return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps({"ok": True})}

        return {"statusCode": 405, "headers": CORS_HEADERS, "body": json.dumps({"error": "Метод не поддерживается"})}

    finally:
        cur.close()
        conn.close()
