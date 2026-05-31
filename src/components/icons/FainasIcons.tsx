import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const defaults: IconProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export function IconPendente(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="m18 15-6-6-6 6" />
    </svg>
  )
}

export function IconAndamento(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="M12 2v10" />
      <path d="M18.4 8.4a9 9 0 0 1-12.8 0" />
      <path d="M21 12a9 9 0 1 1-9-9" />
      <path d="M12 7l-5-5-5 5" />
    </svg>
  )
}

export function IconFinalizados(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="M22 4L12 14.01l-3-3" />
    </svg>
  )
}
