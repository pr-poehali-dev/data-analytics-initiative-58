import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

const API_URL = "https://functions.poehali.dev/77b5dc6b-8bfb-40d9-9a40-f418ac34ccd3"

interface Article {
  id: number
  tag: string
  title: string
  excerpt: string
  content: string
  read_time: string
  created_at: string
}

export default function ArticlePage() {
  const { id } = useParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}?id=${id}`)
      .then((r) => r.json())
      .then((data) => { setArticle(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-stone to-transparent animate-pulse" />
        </div>
        <Footer />
      </main>
    )
  }

  if (!article) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center gap-6">
          <p className="font-serif text-3xl text-foreground">Статья не найдена</p>
          <Link to="/" className="text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors">
            На главную
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Header />
      <article className="pt-40 pb-32 px-6 lg:px-12">
        <div className="max-w-2xl mx-auto">
          {/* Back */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors mb-16"
          >
            <svg className="w-3 h-3 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            Назад
          </Link>

          {/* Meta */}
          <div className="flex items-center gap-6 mb-8">
            <span className="text-xs tracking-[0.2em] uppercase text-terracotta">{article.tag}</span>
            <span className="text-xs text-muted-foreground">{article.read_time}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(article.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-[1.1] text-foreground mb-10 text-balance">
            {article.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg text-muted-foreground leading-relaxed mb-12 border-l-2 border-terracotta pl-6">
            {article.excerpt}
          </p>

          {/* Divider */}
          <div className="w-12 h-px bg-border mb-12" />

          {/* Content */}
          <div className="prose-custom space-y-6 text-foreground leading-[1.9]">
            {article.content.split("\n").filter(Boolean).map((para, i) => (
              <p key={i} className="text-base md:text-lg text-muted-foreground leading-relaxed">
                {para}
              </p>
            ))}
          </div>
        </div>
      </article>
      <Footer />
    </main>
  )
}
