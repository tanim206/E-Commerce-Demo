import type { Metadata } from "next";
import "./globals.css";
import Navbar  from "@/components/sharedComponents/Navbar"
import NextAuthSessionProvider from "@/providers/NextAuthSessionProvider"
import StoreProvider from "@/providers/StoreProvider";


export const metadata: Metadata = {
  title: "Technical Information Technology Bangladesh",
  description:
    "Technical Information Technology Bangladesh is a leading IT company providing innovative solutions, digital services, and technical support to businesses and individuals across Bangladesh.",
  keywords: [
    "Technical",
    "Information",
    "Technology",
    "Bangladesh",
    "IT services",
    "software solutions",
    "technical support",
    "digital transformation",
    "Bangladesh IT company",
  ],
  authors: [{ name: "Technical Information Technology Bangladesh", url: "https://www.technicalinfotechbd.com" }],
  creator: "Technical Information Technology Bangladesh",
  publisher: "Technical Information Technology Bangladesh",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
  openGraph: {
    title: "Technical Information Technology Bangladesh",
    description:
      "Leading IT company providing innovative solutions, digital services, and technical support to businesses and individuals across Bangladesh.",
    url: "https://titb.suhadahmodkhan.com",
    siteName: "Technical Information Technology Bangladesh",
    images: [
      {
        url: "https://res.cloudinary.com/dc3czyqsb/image/upload/v1745798463/PDF/s552tfeqvqdhqjpsq26m.png", // your OpenGraph image
        width: 1200,
        height: 630,
        alt: "Technical Information Technology Bangladesh",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Technical Information Technology Bangladesh",
    description:
      "Leading IT company offering digital transformation, IT services, and technical support across Bangladesh.",
    images: ["https://res.cloudinary.com/dc3czyqsb/image/upload/v1745798463/PDF/s552tfeqvqdhqjpsq26m.png"], // your Twitter card image
    creator: "@YourTwitterHandle", // optional
  },
  icons: {
    icon: "https://res.cloudinary.com/dc3czyqsb/image/upload/v1745798463/PDF/s552tfeqvqdhqjpsq26m.png",
    shortcut: "https://res.cloudinary.com/dc3czyqsb/image/upload/v1745798463/PDF/s552tfeqvqdhqjpsq26m.png",
    apple: "https://res.cloudinary.com/dc3czyqsb/image/upload/v1745798463/PDF/s552tfeqvqdhqjpsq26m.png",
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)


{
  
  return (
    <html lang="en" >
      <head>
      <meta name="viewport" content="width=300, initial-scale=1, maximum-scale=1, user-scalable=no"/>
      </head>
     <NextAuthSessionProvider>
      <StoreProvider>
      <body
        className={`font-montserrat antialiased  bg-white `}
      >
       <div className="min-h-screen">
       <Navbar></Navbar>
       {children}
       </div>
      </body>
      </StoreProvider>
    
     </NextAuthSessionProvider>
    </html>
  );
}
