import img from "@assets/img/temp.png";

function SideImage() {
  return (
    <div className="image-wrapper">
      <img src={img} alt="" />
      <div className="image_text">
        <h3 className="username">@dkomeza</h3>
        <p className="description">A photo taken a long long time ago</p>
      </div>
    </div>
  );
}

export default SideImage;
