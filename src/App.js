import './App.css';
import React, { useState } from 'react';
import ImageMapperEditor, { Mode } from './ImageMapperEditor';
import Plus from '../src/images/plus.png';
import X from '../src/images/remove.png';

function App() {
  const [shape, setShape] = useState(Mode.RECT);
  const [img, setImg] = useState();
  const [zoneInfo, setZoneInfo] = useState(false);
  const [rowNum, setRowNum] = useState(1);
  const [formData, setFormData] = useState();

  const handleImageUpload = (event) => {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      const imageUrl = URL.createObjectURL(selectedImage);
      setImg(imageUrl);
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

    console.log(document.querySelector('.highlighted'));

    document.querySelector('.highlighted').classList.add('done');
    document.querySelector('.highlighted').classList.remove('highlighted');
    setShape(Mode.SELECT);
    setZoneInfo(false);
  }

  return (
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
                editor.loadImage(img, 700, 350);
                editor.polygon();
              }}
              options={{}}
              handleShapeClick={handleShapeClick}
            />
          </>
        )}
      </div>
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
                placeholder={`Cijena sjelada u zoni`}
              />
              <button type="submit">Spremi zonu</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
