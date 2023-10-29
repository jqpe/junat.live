# Testing junat.live

Unit tests are colocated with their source code files. The `/tests` directory is to be used for e2e, regression and integration tests.
Components are tested with Storybook's test runner or `@testing-library/react` package. Hooks use the latter. When you browse around the code,
you will notice that components might have a helpers file next to them. This is by design, complicated logic should be separated from component files, 
which allows us to unit test more complicated functionality without adding unneeded complexity to the tests. 

The unit tests use Vitest as their test runner. Component tests are restricted to an instrumented version of Jest, to enable interoperability with Storybook test runner.
