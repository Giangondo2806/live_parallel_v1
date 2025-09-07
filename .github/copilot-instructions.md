️ **ABSOLUTE LIBRARY RESTRICTION - ZERO TOLERANCE POLICY:**
- **FORBIDDEN:** Installing ANY new libraries beyond those already listed in package.json
- **MANDATORY:** Use ONLY existing libraries from architecture.md dependencies
###### Design Implementation Rules:
 
1.  **MUI Theme Configuration:**
    -   **MUST** configure MUI theme with the Argon color palette.
    -   Use Tailwind CSS for styling, especially for shadows and gradients.
 
2.  **Component Styling with Tailwind:**
    -   **Cards/Containers:** Use `argon-card` class or `bg-white rounded-xl`.
    -   **Primary Buttons:** Use `argon-button-gradient` class for a gradient background.
    -   **Backgrounds:** Main layout = `bg-background`.
    -   **Text:** Primary = `text-gray-700`, Secondary = `text-gray-600` (MUST use `gray`, not `grey`).
    -   **Borders:** Use `border-gray-200` (MUST use `gray`, not `grey`).
 
3.  **Styling Priority Rules:**
    -   **Primary:** Use Tailwind CSS classes for all styling.
    -   **Secondary:** Use `sx` prop ONLY for MUI-specific properties that Tailwind cannot handle (e.g., `textTransform`).
    -   **Forbidden:** Do not use `sx` for colors, spacing, borders, or shadows that can be done with Tailwind.

## 2.2. Tailwind CSS Configuration Rules (CRITICAL)

⚠️ **TAILWIND CSS v4 SPECIFIC REQUIREMENTS:**

### CSS Import Rules:
```css
✅ CORRECT: @import "tailwindcss";
❌ WRONG: @tailwind base; @tailwind components; @tailwind utilities;
❌ WRONG: @import "tailwindcss/base"; @import "tailwindcss/components";
```

### Color Class Rules:
```css
✅ CORRECT: text-gray-700, bg-gray-50, border-gray-200
❌ WRONG: text-grey-700, bg-grey-50, border-grey-200
```

### Layout Component Rules:
```tsx
✅ CORRECT: Use <Box> for layout containers
<Box className="flex justify-between items-center">
  <Typography>Title</Typography>
  <Button>Action</Button>
</Box>

❌ WRONG: Use <Grid> for simple layout
<Grid container justifyContent="space-between">
  <Grid item><Typography>Title</Typography></Grid>
  <Grid item><Button>Action</Button></Grid>
</Grid>
```

### Hover State Rules:
```css
✅ CORRECT: hover:bg-gray-50, hover:bg-gray-100
❌ WRONG: hover:bg-gray-25 (doesn't exist in Tailwind)
```

### Custom Styles Rules:
```css
✅ CORRECT: Use standard CSS in globals.css
.argon-card {
  background: white;
  border-radius: 0.75rem;
}

❌ WRONG: Use @apply with @layer in Tailwind v4
@layer components {
  .argon-card {
    @apply bg-white rounded-xl;
  }
}
```