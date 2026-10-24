import React from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ion-icon': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          name?: string
          size?: 'small' | 'large'
          color?: string
          src?: string
          class?: string
        },
        HTMLElement
      >
    }
  }
}

interface IonIconProps extends React.HTMLAttributes<HTMLElement> {
  name: string
  className?: string
  size?: 'small' | 'large'
}

export const IonIcon: React.FC<IonIconProps> = ({ name, className = '', size, ...props }) => {
  return React.createElement('ion-icon', {
    name,
    class: className,
    size,
    ...props,
  })
}

export default IonIcon
