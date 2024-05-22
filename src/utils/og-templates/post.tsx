import { SITE } from "@config";
import Image from "next/image";
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
            border: "1px solid #000",
            background: "#fefbfb",
            borderRadius: "4px",
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
              margin: "5px",
              width: "90%",
              height: "90%",
            }}
          >
            <p
              style={{
                fontSize: 72,
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
          src={"https://fe96-73-170-25-28.ngrok-free.app/assets/arach.jpg"}
          alt={SITE.author}
          height={420}
          width={420}
          style={{
            border: "1px solid rgba(20, 20, 20, 0.8)",
            borderRadius: "50%",
          }}
        />
      </div>
    </div >
  );
};
