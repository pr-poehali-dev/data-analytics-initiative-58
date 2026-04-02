export function Footer() {
  return (
    <footer className="py-16 px-6 lg:px-12 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-12 gap-12">
          {/* Logo & Tagline */}
          <div className="md:col-span-4">
            <p className="font-serif text-2xl tracking-wide text-foreground mb-4">Тихое присутствие</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Блог о внутренней жизни человека. Просто. Честно. С заботой.
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-2 md:col-start-7">
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-4">Навигация</p>
            <nav className="flex flex-col gap-3">
              <a href="#philosophy" className="text-sm text-foreground hover:text-sage transition-colors">
                О себе
              </a>
              <a href="#services" className="text-sm text-foreground hover:text-sage transition-colors">
                Темы
              </a>
              <a href="#process" className="text-sm text-foreground hover:text-sage transition-colors">
                Подход
              </a>
              <a href="#contact" className="text-sm text-foreground hover:text-sage transition-colors">
                Написать мне
              </a>
            </nav>
          </div>

          {/* Social */}
          <div className="md:col-span-2">
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-4">Соцсети</p>
            <nav className="flex flex-col gap-3">
              <a href="#" className="text-sm text-foreground hover:text-sage transition-colors">
                Instagram
              </a>
              <a href="#" className="text-sm text-foreground hover:text-sage transition-colors">
                Pinterest
              </a>
              <a href="#" className="text-sm text-foreground hover:text-sage transition-colors">
                Telegram
              </a>
            </nav>
          </div>

          {/* Legal */}
          <div className="md:col-span-2">
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-4">Документы</p>
            <nav className="flex flex-col gap-3">
              <a href="#" className="text-sm text-foreground hover:text-sage transition-colors">
                Политика
              </a>
              <a href="#" className="text-sm text-foreground hover:text-sage transition-colors">
                Условия
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Тихое присутствие. Все права защищены.
          </p>
          <p className="text-xs text-muted-foreground">Создано с намерением</p>
        </div>
      </div>
    </footer>
  )
}