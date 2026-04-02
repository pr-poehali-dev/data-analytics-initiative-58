import { useEffect, useRef, useState } from "react"

export function Philosophy() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="philosophy" className="py-32 lg:py-40 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image */}
          <div
            className={`relative aspect-[4/5] bg-sand overflow-hidden transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <img
              src="/minimalist-japanese-interior-design-with-natural-w.jpg"
              alt="Минималистичный интерьер с натуральным деревом"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay accent */}
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-terracotta/80" />
          </div>

          {/* Content */}
          <div className="lg:pl-8">
            <p
              className={`text-xs tracking-[0.3em] uppercase text-terracotta mb-6 transition-all duration-1000 delay-200 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              О себе
            </p>

            <h2
              className={`font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-[1.1] text-foreground mb-8 text-balance transition-all duration-1000 delay-300 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              Психология
              <span className="italic"> без</span>
              <br />
              лишних слов
            </h2>

            <div
              className={`space-y-6 text-muted-foreground leading-relaxed transition-all duration-1000 delay-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p>
                Я студент-психолог, и эти статьи — мой способ делиться знаниями с теми, кто ещё не дошёл до кабинета специалиста, но уже чувствует, что хочет разобраться в себе.
              </p>
              <p>
                Пишу о том, что происходит с нами в отношениях, в моменты тревоги и потерь — <em className="text-foreground">просто</em>, без диагнозов и сложных терминов. Только то, что действительно помогает.
              </p>
            </div>

            {/* Stats */}
            <div
              className={`grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-border transition-all duration-1000 delay-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <div>
                <p className="font-serif text-3xl md:text-4xl text-sage">4+</p>
                <p className="text-xs tracking-widest uppercase text-muted-foreground mt-2">Года обучения</p>
              </div>
              <div>
                <p className="font-serif text-3xl md:text-4xl text-sage">∞</p>
                <p className="text-xs tracking-widest uppercase text-muted-foreground mt-2">Интереса к людям</p>
              </div>
              <div>
                <p className="font-serif text-3xl md:text-4xl text-sage">1</p>
                <p className="text-xs tracking-widest uppercase text-muted-foreground mt-2">Честный взгляд</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}