import { SITE } from "@config";
import type { CollectionEntry } from "astro:content";

export default (post: CollectionEntry<"blog">) => {
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
            background: "#fefbfb",
            borderRadius: "2px",
            display: "flex",
            justifyContent: "center",
            margin: "2rem",
            width: "94%",
            height: "84%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              margin: "10px",
              width: "90%",
              height: "90%",
            }}
          >
            <p
              style={{
                marginTop: "60px",
                fontSize: 59,
                fontWeight: "bold",
                maxHeight: "84%",
                overflow: "hidden",
              }}
            >
              {post.data.title}
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                marginBottom: "8px",
                fontSize: 28,
              }}
            >
              <span>
                by{" "}
                <span
                  style={{
                    color: "transparent",
                  }}
                >
                  "
                </span>
                <span style={{ overflow: "hidden", fontWeight: "bold" }}>
                  {post.data.author}
                </span>
              </span>

              <span style={{ overflow: "hidden", fontWeight: "bold" }}>
                {SITE.title}
              </span>
            </div>
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
          background: "#ddd4c7",
        }}
      >
        <img
          src={"https://arach.io/assets/arach.jpg"}
          alt={SITE.author}
          height={420}
          width={420}
          style={{
            border: "1px solid rgba(150, 150, 150, 0.8)",
            borderRadius: "50%",
          }}
        />
      </div>
    </div >
  );
};
