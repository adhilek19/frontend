import React from 'react'
import Carousel from 'react-bootstrap/Carousel'
import ads from '../assets/video/ads.mp4'

function Slids() {
  return (
    <div >
      <Carousel
        controls={false}
        indicators={false}
        pause={false}
        interval={null}
      >

        <Carousel.Item>
          <video
            className="d-block w-100"
            src={ads}
            autoPlay
            loop
            muted
            playsInline
            style={{ height: '91vh', objectFit: 'cover' }}
          />
        </Carousel.Item>

        <Carousel.Item>
          <video
            className="d-block w-100"
            src={ads}
            autoPlay
            loop
            muted
            playsInline
            style={{ height: '70vh', objectFit: 'cover' }}
          />
        </Carousel.Item>

      </Carousel>
    </div>
  )
}

export default Slids
