import React from 'react'
import roomsData from '../data/rooms.json'

export default function TestImages() {
  const sections = Object.values(roomsData.sections)
  
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Room Images Test</h1>
      {sections.map(section => (
        <div key={section.id} className="mb-8">
          <h2 className="text-xl font-bold mb-4">{section.name.en}</h2>
          <div className="grid grid-cols-3 gap-4">
            {section.rooms.map(room => (
              <div key={room.id} className="border p-4">
                <h3 className="font-semibold">{room.name.en}</h3>
                <p className="text-sm text-gray-600 mb-2">Images: {room.images.length}</p>
                {room.images.map((img, idx) => (
                  <div key={idx} className="mb-2">
                    <p className="text-xs">{img}</p>
                    <img 
                      src={`/${img}`} 
                      alt={room.name.en}
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.border = '2px solid red'
                      }}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}