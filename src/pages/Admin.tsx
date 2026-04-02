import { useEffect, useState } from "react"

const API_URL = "https://functions.poehali.dev/77b5dc6b-8bfb-40d9-9a40-f418ac34ccd3"

const TAGS = ["Тревога", "Отношения", "Эмоции", "Самопознание", "Стресс", "Другое"]

interface Article {
  id: number
  tag: string
  title: string
  excerpt: string
  content: string
  read_time: string
  published: boolean
  created_at: string
}

const empty = { tag: "Тревога", title: "", excerpt: "", content: "", read_time: "5 мин", published: true }

export default function Admin() {
  const [token, setToken] = useState("")
  const [authed, setAuthed] = useState(false)
  const [error, setError] = useState("")
  const [articles, setArticles] = useState<Article[]>([])
  const [form, setForm] = useState({ ...empty })
  const [editId, setEditId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [view, setView] = useState<"list" | "form">("list")

  const headers = { "Content-Type": "application/json", "X-Admin-Token": token }

  const loadArticles = (t: string) => {
    fetch(API_URL, { headers: { "X-Admin-Token": t } })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) { setArticles(data); setAuthed(true) }
        else setError("Неверный пароль")
      })
      .catch(() => setError("Ошибка подключения"))
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    loadArticles(token)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const method = editId ? "PUT" : "POST"
    const url = editId ? `${API_URL}?id=${editId}` : API_URL
    await fetch(url, { method, headers, body: JSON.stringify(form) })
    setSaving(false)
    setForm({ ...empty })
    setEditId(null)
    setView("list")
    loadArticles(token)
  }

  const handleEdit = (a: Article) => {
    setForm({ tag: a.tag, title: a.title, excerpt: a.excerpt, content: a.content, read_time: a.read_time, published: a.published })
    setEditId(a.id)
    setView("form")
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Удалить статью?")) return
    await fetch(`${API_URL}?id=${id}`, { method: "DELETE", headers })
    loadArticles(token)
  }

  const handleNew = () => {
    setForm({ ...empty })
    setEditId(null)
    setView("form")
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <p className="font-serif text-3xl text-foreground mb-2">Тихое присутствие</p>
          <p className="text-xs tracking-widest uppercase text-muted-foreground mb-10">Панель управления</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-3">Пароль</label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full bg-transparent border-b border-border py-3 text-foreground focus:border-sage focus:outline-none transition-colors"
                placeholder="Введите пароль"
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button type="submit" className="w-full py-4 bg-sage text-primary-foreground text-sm tracking-widest uppercase hover:bg-sage/90 transition-colors">
              Войти
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (view === "form") {
    return (
      <div className="min-h-screen bg-background px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <p className="font-serif text-2xl text-foreground">{editId ? "Редактировать" : "Новая статья"}</p>
            <button onClick={() => setView("list")} className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors">
              Отмена
            </button>
          </div>
          <form onSubmit={handleSave} className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-3">Тег</label>
                <select
                  value={form.tag}
                  onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  className="w-full bg-transparent border-b border-border py-3 text-foreground focus:border-sage focus:outline-none transition-colors"
                >
                  {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-3">Время чтения</label>
                <input
                  value={form.read_time}
                  onChange={(e) => setForm({ ...form, read_time: e.target.value })}
                  className="w-full bg-transparent border-b border-border py-3 text-foreground focus:border-sage focus:outline-none transition-colors"
                  placeholder="5 мин"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-3">Заголовок</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-transparent border-b border-border py-3 text-foreground focus:border-sage focus:outline-none transition-colors"
                placeholder="Название статьи"
                required
              />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-3">Краткое описание</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                rows={3}
                className="w-full bg-transparent border-b border-border py-3 text-foreground focus:border-sage focus:outline-none transition-colors resize-none"
                placeholder="Пара предложений о чём статья..."
                required
              />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-3">Текст статьи</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={14}
                className="w-full bg-transparent border-b border-border py-3 text-foreground focus:border-sage focus:outline-none transition-colors resize-none"
                placeholder="Пишите здесь... Каждый абзац — отдельная строка."
                required
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="published"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="accent-sage"
              />
              <label htmlFor="published" className="text-sm text-muted-foreground">Опубликовать сразу</label>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-4 bg-sage text-primary-foreground text-sm tracking-widest uppercase hover:bg-sage/90 transition-colors disabled:opacity-50"
            >
              {saving ? "Сохраняю..." : "Сохранить"}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="font-serif text-2xl text-foreground">Тихое присутствие</p>
            <p className="text-xs tracking-widest uppercase text-muted-foreground mt-1">Статьи · {articles.length}</p>
          </div>
          <button
            onClick={handleNew}
            className="px-6 py-3 bg-sage text-primary-foreground text-xs tracking-widest uppercase hover:bg-sage/90 transition-colors"
          >
            + Новая статья
          </button>
        </div>

        {articles.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-muted-foreground">Статей пока нет. Напишите первую!</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {articles.map((a) => (
              <div key={a.id} className="py-6 flex items-start justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs tracking-widest uppercase text-terracotta">{a.tag}</span>
                    {!a.published && <span className="text-xs text-muted-foreground border border-border px-2 py-0.5">Черновик</span>}
                  </div>
                  <p className="font-serif text-lg text-foreground truncate">{a.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(a.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })} · {a.read_time}
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <button onClick={() => handleEdit(a)} className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors">
                    Изменить
                  </button>
                  <button onClick={() => handleDelete(a.id)} className="text-xs tracking-widest uppercase text-muted-foreground hover:text-red-500 transition-colors">
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
