import { FaCircle } from "react-icons/fa";

const activities = [
  { text: "Dr. Amelia Hart submitted new research", time: "2 mins ago" },
  { text: "Dr. Noah Bennett's study was approved", time: "8 mins ago" },
  { text: "New species added to Cretaceous Era database", time: "15 mins ago" },
  { text: "Dr. Sophia Lee reached 1K citations", time: "22 mins ago" },
  {
    text: "Dr. Ethan Cole commented on Triceratops study",
    time: "34 mins ago",
  },
  { text: "128th research paper published this month", time: "1 hour ago" },
];

export default function ActivityTicker() {
  const loopItems = [...activities, ...activities];

  return (
    <div className="activityTicker">
      <div className="atTrack">
        {loopItems.map((item, i) => (
          <div className="atItem" key={i}>
            <FaCircle className="atDot" />
            <span className="atText">{item.text}</span>
            <span className="atTime">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
