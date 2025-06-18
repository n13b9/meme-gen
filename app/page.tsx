`use client`
import Link from "next/link";

// interface ma aap jo bhui name de sakta ho and jo jo aapna render karana hai wo aap iska andar dadain type ka sath
interface Get_Memes {
  url: string;
  id: string;
  name: string;
  box_count: number;
  // height: number;
  // width: number;
}

// console.log(`hello`)
const Meme = async () => {
  const products = await fetch(`https://api.imgflip.com/get_memes`);
  const response = await products.json();
  console.log(response);

  return (
    <>
      <h1 className="text-4xl text-center font-extrabold p-4 bg-info">
        Meme maker app
      </h1>
      <div
        className="bg-blue-100"
        style={{
          display: `flex`,
          justifyContent: `space-around`,
          gap: `100px`,
          flexWrap: `wrap`,
          // backgroundColor: `red`,
        }}
      >
        {response.data.memes.map((item: Get_Memes) => {
          return (
            <div
              style={{
                background: `white`,
                textAlign: `center`,
                marginTop: `40px`,
                boxSizing: `border-box`,
                padding: `10px`,
                width: `380px`,
                // border: `10px solid black`,
                borderRadius: `20px`,
                boxShadow: `20px 10px 20px 10px grey`,
              }}
              key={item.id}
            >
              <img
                src={item.url}
                alt="image"
                style={{
                  width: "350px",
                  height: "350px",
                  objectFit: "cover", // Adjusts how the image fits into the container
                }}
              />

              <Link
                href={{
                  pathname: "memegenerator/",
                  query: {
                    url: item.url,
                    boxCount: item.box_count,
                    id: item.id,
                    name: item.name,
                  },
                }}
              >
                <button className="btn btn-info p-4 text-center mt-4 ">
                  Generate a meme
                </button>
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Meme;

// const meme = async () => {
//   const prod = await fetch(`https://api.imgflip.com/get_memes`);
//   const res = await prod.json();
//   console.log(res);
//   }
{
  /* <button className="btn btn-primary btn-outline bg-inherit" onClick={meme}>show APi products</button>  */
}
