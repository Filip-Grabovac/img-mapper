import './App.css';
import React, { useState } from 'react';
import ImageMapperEditor, { Mode } from './ImageMapperEditor';
import Plus from '../src/images/plus.png';
import TestImg from '../src/images/concert_ground_plan.png';

function App() {
  const [shape, setShape] = useState(Mode.RECT);
  const [img, setImg] = useState();
  const [zoneInfo, setZoneInfo] = useState(false);
  const [rowNum, setRowNum] = useState(1);
  const [zones, setZones] = useState([]);
  const [renderNewMap, setRendered] = useState(true);

  const handleImageUpload = (event) => {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      const imageUrl = URL.createObjectURL(selectedImage);
      setImg({
        src: imageUrl,
        filename: selectedImage.name,
      });
    }
  };

  function handleShapeClick(e) {
    const tagName = e.target.tagName.toLowerCase();

    if (
      tagName === 'ellipse' ||
      tagName === 'polygon' ||
      tagName === 'circle' ||
      tagName === 'rect'
    ) {
      setZoneInfo(true);
      if (document.querySelector('.highlighted'))
        document.querySelector('.highlighted').classList.remove('highlighted');
      e.target.classList.add('highlighted');
    }
  }

  function setActiveLink(e) {
    document.querySelector('.active-link').classList.remove('active-link');
    e.target.classList.add('active-link');
  }

  function addZone(e) {
    e.preventDefault();

    const highlightedElement = document.querySelector('.highlighted');

    if (highlightedElement) {
      const tagName = highlightedElement.tagName.toLowerCase();
      let x, y, width, height;
      let type;
      let points;

      if (tagName === 'rect') {
        x = parseFloat(highlightedElement.getAttribute('x'));
        y = parseFloat(highlightedElement.getAttribute('y'));
        width = parseFloat(highlightedElement.getAttribute('width'));
        height = parseFloat(highlightedElement.getAttribute('height'));
        type = 'rectangle';
        points = false;
      } else if (tagName === 'polygon') {
        points = highlightedElement.getAttribute('points').split(' ');
        const xCoords = points.map((point) => parseFloat(point.split(',')[0]));
        const yCoords = points.map((point) => parseFloat(point.split(',')[1]));
        type = 'polygon';

        x = Math.min(...xCoords);
        y = Math.min(...yCoords);
        const maxX = Math.max(...xCoords);
        const maxY = Math.max(...yCoords);
        width = maxX - x;
        height = maxY - y;
      }

      const numOfSeatsInputs = document.querySelectorAll('.num-of-seats');
      const numOfSeats = Array.from(numOfSeatsInputs).map((input) => {
        return {
          row: parseInt(input.getAttribute('data-row')),
          count: parseInt(input.value),
        };
      });

      const seatsPrice = parseFloat(
        document.querySelector('.seats-price').value
      );

      const zoneData = {
        type: type,
        points: points,
        x,
        y,
        width,
        height,
        seats: numOfSeats,
        price: seatsPrice,
      };
      setZones([...zones, zoneData]);

      highlightedElement.classList.add('done');
      highlightedElement.classList.remove('highlighted');
      setZoneInfo(false);
      setRowNum(1);
      setShape(Mode.RECT);
      setShape(Mode.SELECT);
    }
  }

  function saveMap(e) {
    e.preventDefault();

    setZones({ imgFileName: img.filename, zones: zones });
  }

  function handleZoneSelection(e) {
    const tagName = e.target.tagName.toLowerCase();

    if (
      tagName === 'ellipse' ||
      tagName === 'polygon' ||
      tagName === 'circle' ||
      tagName === 'rect'
    ) {
      if (document.querySelector('.highlighted'))
        document.querySelector('.highlighted').classList.remove('highlighted');
      e.target.classList.add('highlighted');
    }
  }

  console.log(zones);
  return (
    <div>
      <div className="image-editor-wrapper">
        <div>
          {!img && (
            <label className="add-image-label">
              <input
                style={{ display: 'none' }}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <img className="add-image" src={Plus} alt="Add Image" />
            </label>
          )}
          {img && (
            <>
              <div className="shape-switcher">
                <a
                  onClick={(e) => {
                    setShape(Mode.RECT);
                    setActiveLink(e);
                  }}
                  className="active-link"
                  href="#"
                >
                  Rectangle
                </a>
                <a
                  onClick={(e) => {
                    setShape(Mode.CIRCLE);
                    setActiveLink(e);
                  }}
                  href="#"
                >
                  Circle
                </a>
                <a
                  onClick={(e) => {
                    setShape(Mode.ELLIPSE);
                    setActiveLink(e);
                  }}
                  href="#"
                >
                  Ellipse
                </a>
                <a
                  onClick={(e) => {
                    setShape(Mode.POLYGON);
                    setActiveLink(e);
                  }}
                  href="#"
                >
                  Draw
                </a>
                <a
                  onClick={(e) => {
                    setShape(Mode.SELECT);
                    setActiveLink(e);
                  }}
                  href="#"
                >
                  Edit or add seats
                </a>
              </div>
              <ImageMapperEditor
                mode={shape}
                cb={(editor) => {
                  editor.loadImage(img.src, 700, 450);
                  editor.polygon();
                }}
                options={{}}
                handleShapeClick={handleShapeClick}
              />
            </>
          )}
        </div>
        {zones[0] && (
          <>
            <div className="zone-list">
              <h2>Zones:</h2>
              <ul>
                {zones.map((zone, index) => (
                  <li key={index}>
                    Zone {index + 1}: shape: {zone.type}, x: {zone.x}, y:{' '}
                    {zone.y}, width: {zone.width}, height: {zone.height}
                    <br />
                    Seats: {JSON.stringify(zone.seats)}, Price: {zone.price}
                  </li>
                ))}
              </ul>
              <a
                onClick={(e) => {
                  saveMap(e);
                }}
                href="#"
              >
                Spremi mapu
              </a>
            </div>
          </>
        )}
        <div>
          {zoneInfo && (
            <>
              <form
                onSubmit={(e) => {
                  addZone(e);
                }}
                className="seats-form"
                action=""
              >
                {Array.from({ length: rowNum }).map((_, i) => {
                  return (
                    <div key={i}>
                      <p>Red {i + 1}</p>
                      <input
                        className="num-of-seats"
                        type="number"
                        name="num_of_seats"
                        placeholder={`Broj sjedala za red ${i + 1}`}
                        data-row={i + 1}
                      />
                    </div>
                  );
                })}

                <img
                  onClick={() => {
                    setRowNum((rowNum) => rowNum + 1);
                  }}
                  src={Plus}
                  alt=""
                />
                <input
                  className="seats-price"
                  type="number"
                  name="seats_price"
                  placeholder={`Cijena sjedala u zoni`}
                />
                <button type="submit">Spremi zonu</button>
              </form>
            </>
          )}
        </div>
      </div>
      {img && (
        <ImageMapperEditor
          mode={Mode.SELECT}
          cb={(editor) => {
            editor.loadImage(img.src, 700, 450);
            editor.polygon();
          }}
          handleShapeClick={handleZoneSelection}
          preDrawnShapes={[
            {
              type: 'rectangle',
              data: {
                x: 255,
                y: 87,
                width: 164,
                height: 87,
              },
            },
            {
              type: 'polygon',
              data: {
                points: '56,86 7,129 7,174 75,173 76,88',
              },
            },
          ]}
        />
      )}
    </div>
  );
}

export default App;
