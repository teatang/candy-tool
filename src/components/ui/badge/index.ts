import { cva, type VariantProps } from 'class-variance-authority'

/**
 * shadcn-vue Badge 徽章样式变体
 */
export const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground shadow-xs',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground shadow-xs',
        outline: 'text-foreground border-border',
        candy:
          'border-primary/25 bg-primary/10 text-primary dark:bg-primary/20 dark:text-pink-300',
        success:
          'border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type BadgeVariants = VariantProps<typeof badgeVariants>
