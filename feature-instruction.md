# Best Practice Feature Implementation Guide

## Feature Structure

```
├── graphql/
│   └── BestPractice.graphql        # GraphQL queries and mutations
├── features/
│   └── best-practice-app/
│       └── best-practice/
│           ├── bestPracticeStore.ts    # State management
│           ├── bestPracticeService.ts  # Business logic
│           └── bestPracticeRepository.ts # Data access
├── feature-components/
│   └── best-practice/
│       ├── Create.vue              # Create form component
│       └── Edit.vue               # Edit form component
└── pages/
    └── best-practice/
        └── best-practice.vue      # Main listing page
```

Please follow @feature-instruction.md step by step to build the `enrollment` feature from the @Enrollment.graphql file.

## Rules & Guidelines

**Important: Review all best practice reference files thoroughly before implementation**

1. Code Style & Linting

   - Strongly focus on copy from best practice
   - Ignore linting errors
   - No need to renaming multi-word component name

2. Type Imports
   - All required types and interfaces are auto-imported
   - No need to manually add type imports
   - Ignore import `GraphQLResponse`, `showGqlError`, `showGqlMutationError`, `bestPracticeService`, `useBestPracticeStore`
   - ignore lint error `import type { BestPracticeService } from '#imports'` because it is not built yet

## Steps

1. Read the `graphql` file to understand the data shape.
2. Build feature in `features/student-app/enrollment/`

   1. `enrollmentService.ts` reference to `features/best-practice-app/best-practice/bestPracticeService.ts`
   2. `enrollmentRepository.ts` reference to `features/best-practice-app/best-practice/bestPracticeRepository.ts`
   3. `enrollmentStore.ts` reference to `features/best-practice-app/best-practice/bestPracticeStore.ts`

3. Build feature components in `feature-components/enrollment/`

   1. `Create.vue` reference to `feature-components/best-practice/Create.vue`
   2. `Edit.vue` reference to `feature-components/best-practice/Edit.vue`

4. Build feature pages in `pages/students/enrollments/`
   1. `index.vue` reference to `pages/best-practice/best-practice.vue`
