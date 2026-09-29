/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Reveal & RevealStagger Components
 * Intersection Observer-based animation components for smooth editorial fade-in and slide-up transitions.
 */

import React, { ElementType } from 'react';
import { useInView, UseInViewOptions } from '../../hooks/useInView';

export type AnimationType =
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'fade'
  | 'zoom-in';

export interface RevealProps extends UseInViewOptions {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  distance?: number;
  easing?: string;
  className?: string;
  style?: React.CSSProperties;
  as?: ElementType;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  animation = 'slide-up',
  delay = 0,
  duration = 800,
  distance = 32,
  easing = 'cubic-bezier(0.16, 1, 0.3, 1)',
  className = '',
  style = {},
  as: Component = 'div',
  threshold = 0.12,
  rootMargin = '0px 0px -40px 0px',
  triggerOnce = true,
}) => {
  const [ref, inView] = useInView<HTMLElement>({
    threshold,
    rootMargin,
    triggerOnce,
  });

  const getInitialTransform = (): string => {
    switch (animation) {
      case 'slide-up':
        return `translate3d(0, ${distance}px, 0)`;
      case 'slide-down':
        return `translate3d(0, -${distance}px, 0)`;
      case 'slide-left':
        return `translate3d(${distance}px, 0, 0)`;
      case 'slide-right':
        return `translate3d(-${distance}px, 0, 0)`;
      case 'zoom-in':
        return 'scale3d(0.96, 0.96, 1)';
      case 'fade':
      default:
        return 'translate3d(0, 0, 0)';
    }
  };

  const dynamicStyle: React.CSSProperties = {
    opacity: inView ? 1 : 0,
    transform: inView ? 'translate3d(0, 0, 0) scale3d(1, 1, 1)' : getInitialTransform(),
    transitionProperty: 'opacity, transform',
    transitionDuration: `${duration}ms`,
    transitionTimingFunction: easing,
    transitionDelay: `${delay}ms`,
    willChange: 'opacity, transform',
    ...style,
  };

  return (
    <Component
      ref={ref as unknown as React.Ref<HTMLElement>}
      className={className}
      style={dynamicStyle}
    >
      {children}
    </Component>
  );
};

export interface RevealStaggerProps extends UseInViewOptions {
  children: React.ReactNode;
  animation?: AnimationType;
  staggerDelay?: number;
  baseDelay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  as?: ElementType;
}

export const RevealStagger: React.FC<RevealStaggerProps> = ({
  children,
  animation = 'slide-up',
  staggerDelay = 120,
  baseDelay = 0,
  duration = 800,
  distance = 28,
  className = '',
  as: Component = 'div',
  threshold = 0.1,
  rootMargin = '0px 0px -40px 0px',
  triggerOnce = true,
}) => {
  const [ref, inView] = useInView<HTMLElement>({
    threshold,
    rootMargin,
    triggerOnce,
  });

  return (
    <Component ref={ref as unknown as React.Ref<HTMLElement>} className={className}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;

        const delay = baseDelay + index * staggerDelay;
        const initialTransform =
          animation === 'slide-up'
            ? `translate3d(0, ${distance}px, 0)`
            : animation === 'slide-down'
            ? `translate3d(0, -${distance}px, 0)`
            : animation === 'slide-left'
            ? `translate3d(${distance}px, 0, 0)`
            : animation === 'slide-right'
            ? `translate3d(-${distance}px, 0, 0)`
            : animation === 'zoom-in'
            ? 'scale3d(0.96, 0.96, 1)'
            : 'translate3d(0, 0, 0)';

        const childStyle: React.CSSProperties = {
          opacity: inView ? 1 : 0,
          transform: inView ? 'translate3d(0, 0, 0) scale3d(1, 1, 1)' : initialTransform,
          transitionProperty: 'opacity, transform',
          transitionDuration: `${duration}ms`,
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDelay: `${delay}ms`,
          willChange: 'opacity, transform',
        };

        return <div style={childStyle}>{child}</div>;
      })}
    </Component>
  );
};
