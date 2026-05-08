import { useEffect, useRef } from 'react'

const AD_CONFIG = {
  leaderboard: {
    format: 'auto',
    style: { display: 'block', width: '100%', height: '90px' },
    fullWidthResponsive: true,
  },
  rectangle: {
    format: 'auto',
    style: { display: 'inline-block', width: '300px', height: '250px' },
    fullWidthResponsive: false,
  },
  banner: {
    format: 'auto',
    style: { display: 'block', width: '100%', height: '90px' },
    fullWidthResponsive: true,
  },
}

const AdSlot = ({ size = 'banner', slot }) => {
  const ref = useRef(null)

  useEffect(() => {
    try {
      if (ref.current && ref.current.getAttribute('data-adsbygoogle-status') !== 'done') {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (e) {
      // adsbygoogle not ready yet — ad will load when script arrives
    }
  }, [])

  const { format, style, fullWidthResponsive } = AD_CONFIG[size]

  return (
    <ins
      ref={ref}
      className="adsbygoogle"
      style={style}
      data-ad-client="ca-pub-5228225989109147"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
    />
  )
}

export default AdSlot
