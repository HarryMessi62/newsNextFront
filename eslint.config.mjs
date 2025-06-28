import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Отключаем правила для неэкранированных кавычек
      "react/no-unescaped-entities": "off",
      
      // Отключаем предупреждения о неиспользуемых переменных (оставляем только ошибки)
      "@typescript-eslint/no-unused-vars": "warn",
      
      // Отключаем правило о типе any (иногда нужен для API ответов)
      "@typescript-eslint/no-explicit-any": "warn",
      
      // Отключаем предупреждения о тегах img (Next.js Image иногда избыточен)
      "@next/next/no-img-element": "warn",
      
      // Отключаем правило prefer-const для некоторых случаев
      "prefer-const": "warn",
      
      // Отключаем правила React hooks exhaustive deps (иногда намеренно)
      "react-hooks/exhaustive-deps": "warn"
    }
  }
];

export default eslintConfig;
