import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ref = (name) => `/reference/webdev/${name}`;
const interestItems = [
  ["explore-car.png", "Inside a quiet evening drive"],
  ["explore-camper.png", "Coffee by the sea"],
  ["explore-city.png", "City window at dusk"],
  ["explore-road.png", "Long road through the hills"],
  ["explore-dinner.png", "Friends around the table"],
  ["explore-work.png", "Studio workday"],
  ["explore-dog.png", "Morning walk"],
  ["explore-mountain.png", "Green mountain trail"],
  ["explore-laptop.png", "Desk notes"],
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
