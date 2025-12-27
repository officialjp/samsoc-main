# ScrollAnimationWrapper Component

A flexible React component for adding scroll-triggered animations to your pages using the Intersection Observer API.

## Features

- ✨ Multiple animation variants (fade, slide, scale, rotate)
- 🎯 Customizable trigger threshold and delay
- ♿ Reduced motion support for accessibility
- 🎨 Smooth, performant CSS animations
- 🔧 TypeScript support with full type safety
- 📱 Mobile-friendly with responsive animations

## Installation

The component is already installed in your project. Just import it:

```tsx
import ScrollAnimationWrapper from '~/components/shared/scroll-animation-wrapper';
```

## Basic Usage

### Simple Fade In

```tsx
<ScrollAnimationWrapper>
  <YourComponent />
</ScrollAnimationWrapper>
```

### With Custom Animation Variant

```tsx
<ScrollAnimationWrapper variant="fadeInLeft">
  <YourComponent />
</ScrollAnimationWrapper>
```

### With Delay (Staggered Animations)

```tsx
{items.map((item, index) => (
  <ScrollAnimationWrapper 
    key={item.id}
    variant="fadeInUp"
    delay={index * 100}
  >
    <ItemCard {...item} />
  </ScrollAnimationWrapper>
))}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | Required | Content to animate |
| `variant` | `AnimationVariant` | `'fadeInUp'` | Animation type to use |
| `tag` | `ElementType` | `'div'` | HTML element to render as |
| `triggerOnce` | `boolean` | `true` | Whether animation triggers only once |
| `threshold` | `number` | `0.15` | Percentage of element visible before triggering (0-1) |
| `delay` | `number` | `0` | Delay in milliseconds before animation starts |
| `className` | `string` | `undefined` | Additional CSS classes |
| `id` | `string` | `undefined` | HTML id attribute |

## Animation Variants

### `fadeInUp` (Default)
Fades in while sliding up from below.
- **Use for**: General content, cards, sections
- **Effect**: Element appears from 60px below with fade

### `fadeIn`
Simple opacity fade-in.
- **Use for**: Subtle reveals, overlays, backgrounds
- **Effect**: Element fades from 0 to full opacity

### `fadeInRight`
Fades in while sliding from the right.
- **Use for**: Right-side content, images
- **Effect**: Element appears from 60px to the right with fade

### `fadeInLeft`
Fades in while sliding from the left.
- **Use for**: Left-side content, sidebar elements
- **Effect**: Element appears from 60px to the left with fade

### `fadeInScale`
Fades in while scaling from smaller size.
- **Use for**: Featured content, images, important elements
- **Effect**: Element scales from 60% with fade

### `fadeInRotate`
Fades in with a slight rotation and upward movement.
- **Use for**: Creative elements, playful content
- **Effect**: Element rotates from -10deg and slides up 60px

### `fadeInRotate3`
Similar to fadeInRotate but ends with a 3-degree tilt.
- **Use for**: Cards with personality, casual elements
- **Effect**: Element rotates from -10deg to +3deg and slides up

## Common Patterns

### Section Headings

```tsx
<ScrollAnimationWrapper variant="fadeInUp">
  <SectionHeading
    badge="ABOUT US"
    title="What We're All About"
    description="Description text here"
    badgeColor="bg-purple-200"
  />
</ScrollAnimationWrapper>
```

### Staggered Grid Items

```tsx
<div className="grid grid-cols-3 gap-6">
  {items.map((item, index) => (
    <ScrollAnimationWrapper
      key={item.id}
      variant="fadeInUp"
      delay={index * 100}
    >
      <Card {...item} />
    </ScrollAnimationWrapper>
  ))}
</div>
```

### Side-by-Side Content

```tsx
<div className="grid md:grid-cols-2 gap-8">
  <ScrollAnimationWrapper variant="fadeInLeft" delay={100}>
    <LeftContent />
  </ScrollAnimationWrapper>
  
  <ScrollAnimationWrapper variant="fadeInRight" delay={100}>
    <RightContent />
  </ScrollAnimationWrapper>
</div>
```

### Featured Image with Scale

```tsx
<ScrollAnimationWrapper variant="fadeInScale" delay={100}>
  <div className="relative">
    <Image src={photo} alt="Featured" />
  </div>
</ScrollAnimationWrapper>
```

### Custom HTML Tag

```tsx
<ScrollAnimationWrapper 
  tag="section"
  variant="fadeInUp"
  id="hero-section"
  className="py-12"
>
  <HeroContent />
</ScrollAnimationWrapper>
```

### Repeated Animations

Set `triggerOnce={false}` to animate every time the element enters viewport:

```tsx
<ScrollAnimationWrapper 
  variant="fadeIn"
  triggerOnce={false}
>
  <FloatingElement />
</ScrollAnimationWrapper>
```

## Accessibility

The component automatically respects the user's motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  .SAManimController {
    opacity: 1 !important;
    animation: none !important;
    transform: none !important;
  }
}
```

Users who have enabled "Reduce motion" in their OS settings will see content immediately without animations.

## Performance Tips

1. **Don't over-animate**: Not every element needs animation. Focus on key content.
2. **Stagger wisely**: Use delays of 50-150ms between items for best effect.
3. **Group animations**: Wrap containers rather than individual small elements.
4. **Use triggerOnce**: Default `true` prevents re-animation and improves performance.
5. **Optimize threshold**: Lower values (0.1-0.2) trigger earlier, higher values (0.5+) wait for more visibility.

## Examples from the Project

Check these files for real-world usage examples:

- `src/app/(home)/page.tsx` - Multiple variants and staggered animations
- `src/app/gallery/page.tsx` - Simple heading animations
- `src/app/events/page.tsx` - Staggered card animations
- `src/app/calendar/page.tsx` - Multiple sections with delays

## Customization

### Adding New Animation Variants

1. Add keyframes to `src/styles/globals.css`:

```css
@keyframes myCustomAnimation {
  0% {
    opacity: 0;
    transform: translateX(-100px) rotate(45deg);
  }
  100% {
    opacity: 1;
    transform: translateX(0) rotate(0deg);
  }
}
```

2. Add CSS class:

```css
.SAManimController.SAMactive[data-animation='myCustomAnimation'] {
  animation: myCustomAnimation 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: var(--animation-delay, 0ms);
}
```

3. Update TypeScript type in `scroll-animation-wrapper.tsx`:

```tsx
export type AnimationVariant =
  | 'fadeInUp'
  | 'fadeIn'
  | 'fadeInRight'
  | 'fadeInLeft'
  | 'fadeInRotate'
  | 'fadeInRotate3'
  | 'fadeInScale'
  | 'myCustomAnimation'; // Add here
```

## Troubleshooting

### Animation not triggering

- Check that the element has height/width (animations won't trigger on 0-size elements)
- Verify `threshold` isn't too high for the element's size
- Ensure parent containers don't have `overflow: hidden` blocking intersection observer

### Animation feels laggy

- Reduce the number of animated elements on the page
- Increase `threshold` to trigger later
- Use simpler animation variants (e.g., `fadeIn` instead of `fadeInRotate`)

### Content flashes before animating

This is expected - elements start with `opacity: 0` and animate in. The 50ms timeout in the component helps prevent race conditions.

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

Uses `IntersectionObserver` API with the `react-intersection-observer` library for optimal compatibility.

---

**Need help?** Check the component source at `src/components/shared/scroll-animation-wrapper.tsx`
