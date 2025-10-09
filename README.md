# Quiz Format

Create quiz files in markdown format in the `src/quizzes/` directory. The quiz parser supports the following features:

### Basic Question Format

```markdown
# Quiz Title

## Question text here?

- [ ] Wrong answer
- [x] Correct answer (marked with x)
- [ ] Another wrong answer
- [ ] Yet another wrong answer
```

### Adding Images

You can add one or more images to a question using standard markdown image syntax:

```markdown
## What is this landmark?

![Image description](https://example.com/image.jpg)
![Another view](https://example.com/image2.jpg)

- [ ] Option 1
- [x] Correct answer
- [ ] Option 3
```

### Embedding YouTube Videos

Add a YouTube video to a question using the `youtube:` prefix followed by the video URL:

```markdown
## Watch this video and answer: What is the main topic?

youtube: https://www.youtube.com/watch?v=VIDEO_ID

- [ ] Option 1
- [x] Correct answer
- [ ] Option 3
```

Both `youtube.com/watch?v=...` and `youtu.be/...` URL formats are supported.

### Example Quiz with Media

See `src/quizzes/sample.md` for a complete example demonstrating all features including text-only questions, questions with images, questions with YouTube videos, and questions with multiple images.

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
