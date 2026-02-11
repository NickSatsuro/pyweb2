## Процесс выполнения задания 

### Первая часть

* Установлен MkDocs
* Создан контент с текстом различного форматирования, ненумерованным списком и блоком, стилизованным при помощи Tailwind.css 
* Установлена тема material
* Создан actions.yml файл с описанием пайплайна деплоя на GitHub Pages
* Проект задеплоен на GitHub Pages
* Пайплайн проверен путем изменения текстового контента в index.md

Содержимое yml-файла

```yaml
name: Build and Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - name: Install dependencies
        run: |
          pip install -r requirements.txt

      - name: Set up Node JS
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install Node dependencies
        run: npm ci

      - name: Build Tailwind CSS
        run: npm run build:css

      - name: Build Mkdocs
        run: mkdocs build

      - name: Minify
        run: npm run minify

      - name: Validate
        run: npm run validate

      - name: Upload Artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: 'site' 

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to Github Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Вторая часть

* Установлены новые dev зависимости для последующей сборки, стилизации, валидации и минификации
* Создан кастомный стиль сайта при помощи html, css и tailwind 
* Обновлен пайплайн с учетом внесенных изменений
* Дополнен контент index.md для тестирования пайплайна

Этапы сборки

Процесс описывается в файле конфигурации рабочего процесса и инициируется автоматически при отправке изменений (push) в ветку main. Конвейер состоит из двух последовательных jobs: build (сборка) и deploy (развертывание).

Сборка выполняется на виртуальном окружении ubuntu-latest
Выполняется загрузка репозитория с помощью actions/checkout
Инициализируются среды выполнения Python версии 3.12 и Node.js версии 20 с кэшированием пакетов npm для ускорения повторных сборок
Устанавливаются Python-библиотеки согласно файлу requirements.txt
Устанавливаются Node.js-пакеты командой npm ci для обеспечения точного соответствия версий
Компилируются стили Tailwind CSS (npm run build:css).
Генерируется статический сайт документации с помощью MkDocs
Выполняется минификация ресурсов (npm run minify)
Проводится валидация сгенерированного HTML-кода (npm run validate)
Скомпилированная директория site загружается как артефакт сборки (pages-artifact)

Этап развертывания запускается только после успешного завершения этапа сборки.
Артефакт сборки развертывается в окружение github-pages с использованием официального действия actions/deploy-pages