import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"

const API_URL = "https://functions.poehali.dev/77b5dc6b-8bfb-40d9-9a40-f418ac34ccd3"

interface Article {
  id: number
  tag: string
  title: string
  excerpt: string
  read_time: string
}

const FALLBACK: Article[] = [
  { id: 0, tag: "Тревога", title: "Почему тревога не исчезает, даже когда всё хорошо", excerpt: "Иногда мы чувствуем беспокойство без видимой причины. Разбираемся, откуда оно берётся и почему мозг продолжает искать угрозу даже в безопасности.", read_time: "5 мин" },
  { id: 0, tag: "Отношения", title: "Близость пугает. И это нормально", excerpt: "Мы хотим любви и тепла — и одновременно боимся подпустить человека слишком близко. Про то, как устроена привязанность и почему она бывает такой сложной.", read_time: "7 мин" },
  { id: 0, tag: "Эмоции", title: "Злость — не враг. Она что-то говорит вам", excerpt: "Нас учили сдерживаться и не злиться. Но злость — это сигнал, а не недостаток характера. О том, как научиться её слышать, а не подавлять.", read_time: "4 мин" },
  { id: 0, tag: "Самопознание", title: "Что такое психологические границы и зачем они вам", excerpt: "Слово «границы» звучит модно, но мало кто понимает, что это на самом деле. Без терминов — о том, как они работают в реальной жизни.", read_time: "6 мин" },
  { id: 0, tag: "Стресс", title: "Хроническая усталость: когда отдых не помогает", excerpt: "Вы высыпаетесь, берёте паузы — а сил всё равно нет. Разбираем, почему усталость бывает не физической, а эмоциональной, и что с этим делать.", read_time: "8 мин" },
  { id: 0, tag: "Самопознание", title: "Внутренний критик: кто этот голос в голове?", excerpt: "«Ты недостаточно стараешься», «опять облажался» — знакомо? Про то, откуда берётся внутренний критик и можно ли с ним подружиться.", read_time: "5 мин" },
]

export function Articles() {
  const [isVisible, setIsVisible] = useState(false)
  const [articles, setArticles] = useState<Article[]>([])
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    fetch(API_URL)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setArticles(data) })
      .catch(() => {})
  }, [])

  const displayArticles = articles.length > 0 ? articles : FALLBACK

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="articles" className="py-32 lg:py-40 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <p
            className={`text-xs tracking-[0.3em] uppercase text-terracotta mb-6 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Статьи
          </p>
          <h2
            className={`font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground text-balance transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Читать
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {displayArticles.map((article, index) => {
            const inner = (
              <div
                className={`group bg-background p-8 lg:p-10 flex flex-col gap-5 hover:bg-card transition-all duration-1000 h-full ${
                  article.id > 0 ? "cursor-pointer" : "cursor-default"
                } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs tracking-[0.2em] uppercase text-terracotta">{article.tag}</span>
                  <span className="text-xs text-muted-foreground">{article.read_time}</span>
                </div>
                <h3 className="font-serif text-xl md:text-2xl text-foreground leading-snug group-hover:text-sage transition-colors duration-500">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{article.excerpt}</p>
                {article.id > 0 && (
                  <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground group-hover:text-foreground transition-colors duration-500">
                    Читать
                    <svg className="w-3 h-3 transition-transform duration-500 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                )}
              </div>
            )

            return article.id > 0 ? (
              <Link key={article.id} to={`/article/${article.id}`} className="block">
                {inner}
              </Link>
            ) : (
              <div key={index}>{inner}</div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
