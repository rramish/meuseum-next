import { useImageStorage } from '@/store/imageStore';
import React from 'react'
import Image from 'next/image';

const ReconstructedImage = () => {
    const {finalimage} = useImageStorage();
  return (
    finalimage ? (
        <Image
          src={finalimage}
          alt="Reconstructed Image"
          // width={1200}
          // height={800}
          fill
          // style={{ maxWidth: '100%', height: 'auto' }}
          className="rounded-lg shadow-lg"
        />
      ) : (
        <p>No image available</p>
      )
  )
}

export default ReconstructedImage
