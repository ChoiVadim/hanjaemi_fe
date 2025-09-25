module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!react-markdown|remark-gfm|rehype-highlight|hast-util-to-jsx-runtime|github-slugger|hast-util-sanitize|unist-util-visit|unist-util-is|unist-util-position|unist-util-stringify-position|vfile|vfile-message|zwitch|ccount|comma-separated-tokens|hast-util-whitespace|is-plain-obj|mdast-util-to-string|micromark-util-decode-numeric-character-reference|micromark-util-decode-string|micromark-util-normalize-identifier|micromark-util-resolve-all|micromark-util-sanitize-uri|micromark-util-character|micromark-util-chunked|micromark-util-classify-character|micromark-util-combine-extensions|micromark-util-decode-named-character-reference|micromark-util-encode|micromark-util-html-tag-name|micromark-util-subtokenize|micromark|parse-entities|property-information|space-separated-tokens|stringify-entities|trough|unified|unist-builder|unist-util-generated|unist-util-visit-parents|web-namespaces|decode-named-character-reference|character-entities)',
  ],
};