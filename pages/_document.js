import Document, { Html, Head, Main, NextScript } from "next/document"
import footerContent from "@data/footer.json"
class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href={`/images/${footerContent[0].lowerImage}`}/>
          <link
            href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:ital,wght@0,300;0,400;0,700;1,400&display=swap"
            rel="stylesheet"
          />
          <meta
            name="description"
            content="Financial News, Stock and Capital Makrkets Research, research individual equitites and stock universes to help you better manage your portfolio."
          />
          <meta
            property="og:image"
            content="/images/homepageImages/fintank6.jpg"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
