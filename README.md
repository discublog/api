# @discublog/api

This package is designed for querying the discussions content within a specified GitHub repository, providing complete type definition.

## Installation

```bash
npm install @discublog/api
```

## Usage

This package provides two ways to interact with the discussions in a specific GitHub repository.

### Global Registration for One-Time Setup

You can globally configure the authentication once and use it across the application.

```typescript
import { auth } from '@discublog/api'

auth({
  token: 'your-github-token',
  owner: 'repository-owner',
  name: 'repository-name',
})
```

After setting up `auth`, you can perform API calls based on the configured parameters:

```typescript
import { queryByCategoryName } from '@discublog/api'
// Further API calls
```

### Using the Client Class

Alternatively, you can create an instance of the `Client` class for encapsulated management of API calls.

```typescript
import { Client } from '@discublog/api/client'

const client = new Client({
  token: 'your-github-token',
  owner: 'repository-owner',
  name: 'repository-name',
})

client.queryByCategoryName({ name: 'CategoryName' })
```

This method is particularly useful when you need to manage multiple configurations or prefer an object-oriented approach to interacting with the GitHub API.

## API

```javascript
import {
  search,
  queryByCategoryName,
  queryByCategoryId,
  queryByNumber,
  queryCategories,
  queryLabels,
} from '@discublog/api'
```

## License

[MIT](LICENSE)
