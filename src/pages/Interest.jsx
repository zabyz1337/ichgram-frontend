import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ref = (name) => `/reference/webdev/${name}`;
const interestItems = [
  ["explore-car.jpg", "Inside a quiet evening drive"],
  ["explore-camper.jpg", "Coffee by the sea"],
  ["explore-city.jpg", "City window at dusk"],
  ["explore-road.jpg", "Long road through the hills"],
  ["explore-dinner.jpg", "Friends around the table"],
  ["explore-work.jpg", "Studio workday"],
  ["explore-dog.jpg", "Morning walk"],
  ["explore-mountain.jpg", "Green mountain trail"],
  ["explore-laptop.jpg", "Desk notes"],
].map(([image, text], index) => ({ id: `interest-${index + 1}`, image: ref(image), text }));

export default function Interest() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  const toggle = (id) => {
    setSelected((list) => list.includes(id) ? list.filter((item) => item !== id) : [...list, id]);
  };

  return <main className="interest-page">
    <section>
      <h1>Pick your interests</h1>
      <p>Choose a few posts to personalize your feed.</p>
      <div className="interest-masonry">
        {interestItems.map((item) => <button className={selected.includes(item.id) ? "selected" : ""} onClick={() => toggle(item.id)} key={item.id}>
          <img src={item.image} alt={item.text} />
        </button>)}
      </div>
      <button className="primary-button" onClick={() => navigate("/")}>Continue</button>
      <button className="skip-button" onClick={() => navigate("/")}>Skip for now</button>
    </section>
  </main>;
}
