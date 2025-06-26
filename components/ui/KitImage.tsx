'use client'
import { Image , buildSrc} from '@imagekit/next';
import { useState } from 'react';

const KitImage = (props:any) => {
     const [showPlaceholder, setShowPlaceholder] = useState(true);
  return (
     <Image
      
      {...props}
      loading="eager"
      urlEndpoint='https://ik.imagekit.io/cqy7eyhof'
      style={showPlaceholder ? {
        backgroundImage: `url(${buildSrc({
          urlEndpoint: "https://ik.imagekit.io/cqy7eyhof",
          src: props.src,
          transformation: [
            {
              quality: 10,
              blur: 90,
            }
          ]
        })})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      } : {}}
      onLoad={() => {
        setShowPlaceholder(false);
      }}
    />
  )
}

export default KitImage

// "use client" // This component must be a client component
// import { Image, buildSrc } from "@imagekit/next";
// import { useState } from "react";
// export default function Page() {
//   const [showPlaceholder, setShowPlaceholder] = useState(true);
//   return (
//     <Image
//       src="/default-image.jpg"
//       alt="Next.js logo"
//       width={400}
//       height={400}
//       loading="eager"
//       style={showPlaceholder ? {
//         backgroundImage: `url(${buildSrc({
//           urlEndpoint: "https://ik.imagekit.io/ikmedia",
//           src: "/default-image.jpg",
//           transformation: [
//             // {}, // Any other transformation you want to apply
//             {
//               quality: 10,
//               blur: 90,
//             }
//           ]
//         })})`,
//         backgroundSize: "cover",
//         backgroundRepeat: "no-repeat",
//       } : {}}
//       onLoad={() => {
//         setShowPlaceholder(false);
//       }}
//     />
//   )
// }