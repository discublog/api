import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  documents: ['src/queries.ts'],
  schema: [
    {
      'https://api.github.com/graphql': {
        headers: {
          'User-Agent': 'graphql-codegen/5.0.2',
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      },
    },
  ],
  generates: {
    'src/interface.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-document-nodes',
        {
          add: {
            content: ['// @ts-nocheck'],
          },
        },
      ],
      config: {
        namingConvention: {
          typeNames: 'change-case-all#pascalCase',
          transformUnderscore: true,
        },
        hooks: {
          afterOneFileWrite: ['prettier --write'],
        },
        constEnums: true,
        enumsAsTypes: true,
        documentMode: 'external',
        importDocumentNodeExternallyFrom: './document-node.ts',
        pureMagicComment: true,
        strictScalars: true,
        skipTypename: true,
        useTypeImports: true,
        extractAllFieldsToTypes: true,
        scalars: {
          Base64String: 'string',
          BigInt: 'bigint',
          Date: 'string',
          DateTime: 'string',
          GitObjectID: 'string',
          GitSSHRemote: 'string',
          GitTimestamp: 'string',
          HTML: 'string',
          PreciseDateTime: 'string',
          URI: 'string',
          X509Certificate: 'string',
        },
      },
    },
  },
}

export default config
