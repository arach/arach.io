import { SITE } from "@config";

export default () => {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fefbfb",
          width: "60%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            background: "#fefbfb",
            height: "100%",
            width: "100%",
          }}
        >
          <div
            style={{
              border: "1px dashed rgba(12, 12, 12, 1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              margin: "1rem",
              width: "96%",
            }}
          >
            <p
              style={{
                fontSize: 59,
                fontWeight: "bold",
                overflow: "hidden",
              }}
            >
              {SITE.author}
            </p>
            <p>
              Entrepreneur, software engineer
            </p>
          </div>
        </div>
      </div>
      <div
        style={{
          width: "40%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#313131",
        }}
      >
        <img
          src={"https://arach.io/assets/arach-filter.png"}
          alt={SITE.author}
          height={360}
          width={360}
          style={{
            border: "3px solid rgba(255, 255, 255)",
            borderRadius: "50%",
          }}
        />
      </div>
    </div >
  );
};