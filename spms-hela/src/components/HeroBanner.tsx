type HeroBannerProps = {
  title: string
  subtitle?: string
}

export default function HeroBanner({ title, subtitle }: HeroBannerProps) {
  return (
    <div className="relative h-[400px] w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://i.ibb.co/mVBWrzvS/Banner-web.png)',
        }}
      >
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto drop-shadow-md">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
