import './App.css';
import React, { useState } from 'react';
import ImageMapperEditor, { Mode } from './ImageMapperEditor';
import Plus from '../src/images/plus.png';
import X from '../src/images/remove.png';

function App() {
  const [shape, setShape] = useState(Mode.RECT);
  const [img, setImg] = useState();
  const [seats, setSeats] = useState(0);
  const [seatPrice, setSeatPrice] = useState(0);
  const [seatsStatus, setSeatsStatus] = useState(false);
  const [droppedItems, setDroppedItems] = useState([]);
  const [db, setDb] = useState({ img: 'img.src' });

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
      setSeatsStatus(true);
      if (document.querySelector('.highlighted'))
        document.querySelector('.highlighted').classList.remove('highlighted');
      e.target.classList.add('highlighted');
    }
  }

  function closeEdit() {
    setSeatsStatus(false);
    document.querySelector('.highlighted').classList.remove('highlighted');
  }

  function addSeats(e) {
    e.preventDefault();

    const numSeats = parseInt(e.target.elements.num_of_seats.value);
    const seatPrice = parseInt(e.target.elements.seats_price.value);

    setSeats(numSeats);
    setSeatPrice(seatPrice);
  }

  const handleDragStart = (e, i) => {
    e.dataTransfer.setData('text/plain', i);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    const highlightedElement = document.querySelector('.highlighted');
    if (!highlightedElement) return;

    setSeats((seat) => seat - 1);

    const itemId = e.dataTransfer.getData('text/plain');

    // Get the dimensions and position of the containing element
    const containerRect = e.currentTarget.getBoundingClientRect();

    // Calculate the position relative to the containing element
    const dropX = e.clientX - containerRect.left;
    const dropY = e.clientY - containerRect.top;

    // Get the dimensions and position of the highlighted element
    const highlightedRect = highlightedElement.getBoundingClientRect();

    // Replace these placeholders with the actual dimensions of your draggable element
    const draggableElementWidth = 30; // Replace with actual width
    const draggableElementHeight = 30; // Replace with actual height

    // Calculate the nearest valid drop position within the boundaries of the highlighted element
    const validDropX = Math.min(
      Math.max(dropX, highlightedRect.left),
      highlightedRect.right - draggableElementWidth
    );

    const validDropY = Math.min(
      Math.max(dropY, highlightedRect.top),
      highlightedRect.bottom - draggableElementHeight
    );

    // Add the dropped item to the droppedItems state
    setDroppedItems((prevItems) => [
      ...prevItems,
      { id: itemId, left: validDropX, top: validDropY },
    ]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  function setActiveLink(e) {
    document.querySelector('.active-link').classList.remove('active-link');
    e.target.classList.add('active-link');
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
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="seats-container"
            >
              {droppedItems.map((item, i) => (
                <div
                  key={i}
                  className="dropped-item"
                  style={{ left: item.left, top: item.top }}
                ></div>
              ))}
              <ImageMapperEditor
                mode={shape}
                cb={(editor) => {
                  editor.loadImage(img, 700, 350);
                  editor.on('mouseup', (e) => console.log('mouseup event', e));
                  editor.polygon();
                }}
                options={{
                  selectModeHandler: () =>
                    console.log('Editor is now in select mode'),
                  componentDrawnHandler: (shape, id) =>
                    console.log(
                      `${shape.element.tagName} with id ${id} is drawn. Call its freeze() function to disable selecting, deleting, resizing and moving.`
                    ),
                  viewClickHandler: () => {
                    console.log('Clicked');
                  },
                  onclick: () => {
                    console.log('Clicked');
                  },
                }}
                handleShapeClick={handleShapeClick}
              />
            </div>
          </>
        )}
      </div>
      <div>
        {seatsStatus && (
          <>
            <form className="seats-form" onSubmit={addSeats} action="">
              <input
                type="number"
                name="num_of_seats"
                placeholder="Unesite broj sjedala"
              />
              <input
                type="number"
                name="seats_price"
                placeholder="Unesite cijenu sjedala"
              />
              <button>Dodaj</button>
              <img onClick={closeEdit} src={X} alt="" />
            </form>

            <div className="seats-place">
              {Array.from({ length: seats }).map((_, i) => {
                return (
                  <div
                    draggable
                    className="seat"
                    key={i}
                    onDragStart={(e) => {
                      handleDragStart(e, i);
                    }}
                  ></div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
