const defaultItems = [
  { menu: "Home" },
  {
    menu: "About",
    submenu: [
      { menu: "Web development" },
      {
        menu: "Design",
        submenu: [{ menu: "Graphic design" }, { menu: "UI/UX design" }],
      },
      { menu: "Marketing" },
    ],
  },
  {
    menu: "Services",
    submenu: [
      { menu: "Web development" },
      {
        menu: "Design",
        submenu: [
          { menu: "Graphic design" },
          {
            menu: "UI/UX design",
            submenu: [
              { menu: "Web development" },
              {
                menu: "Design",
                submenu: [{ menu: "Graphic design" }, { menu: "UI/UX design" }],
              },
              { menu: "Marketing" },
            ],
          },
        ],
      },
      { menu: "Marketing" },
    ],
  },
  { menu: "Contact" },
];

function Submenu({ items = defaultItems, depth = 0 }) {
  return (
    <ul
      className={
        depth === 0
          ? "menu-list menu-list-root"
          : depth === 1
            ? "menu-list menu-list-first"
            : "menu-list menu-list-nested"
      }
    >
      {items.map((item, index) => (
        <li
          key={index}
          className={
            item.submenu ? "menu-item menu-item-has-submenu" : "menu-item"
          }
        >
          <a
            className={
              depth > 0
                ? "menu-link menu-link-nested"
                : "menu-link menu-link-root"
            }
            href="#"
          >
            {item.menu}
          </a>
          {item.submenu && <Submenu items={item.submenu} depth={depth + 1} />}
        </li>
      ))}
    </ul>
  );
}

function Menu({ items = defaultItems, isSubmenu = false }) {
  return (
    <nav className="w-full fixed top-0 left-0 z-50">
      <style>{`
                .menu-list {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }
                .menu-list-root {
                    display: flex;
                    float: left;
                  background: linear-gradient(135deg, rgba(255, 255, 255, .34), rgba(148, 163, 184, .18));
                  border: 1px solid rgba(255, 255, 255, .62);
                  border-radius: 1rem;
                  box-shadow: 0 10px 36px rgba(15, 23, 42, .38), inset 0 1px 0 rgba(255, 255, 255, .75), inset 0 -1px 0 rgba(15, 23, 42, .18);
                    position: relative;
                  -webkit-backdrop-filter: blur(20px) saturate(210%) contrast(1.15);
                  backdrop-filter: blur(20px) saturate(210%) contrast(1.15);
                  isolation: isolate;
                }
                .menu-list-root::before {
                  content: "";
                  position: absolute;
                  inset: 0;
                  border-radius: inherit;
                  pointer-events: none;
                  background: linear-gradient(115deg, rgba(255, 255, 255, .28), transparent 35%, rgba(255, 255, 255, .08) 65%, rgba(15, 23, 42, .12));
                  mix-blend-mode: screen;
                  transform: translate(2px, -1px) skewX(-1deg);
                  opacity: .9;
                }
                .menu-item {
                    position: relative;
                }
                .menu-list-first,
                .menu-list-nested {
                    background: #fff;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, .15);
                    display: none;
                    position: absolute;
                    width: 13rem;
                    z-index: 10;
                }
                .menu-list-first {
                    left: 0;
                    top: 100%;
                }
                .menu-list-nested {
                    left: 100%;
                    top: 0;
                }
                .menu-list-first,
                .menu-list-nested {
                  background: linear-gradient(135deg, rgba(255, 255, 255, .5), rgba(203, 213, 225, .3));
                  border: 1px solid rgba(255, 255, 255, .72);
                  border-radius: .85rem;
                  box-shadow: 0 14px 38px rgba(15, 23, 42, .42), inset 0 1px 0 rgba(255, 255, 255, .8), inset 0 -1px 0 rgba(15, 23, 42, .16);
                  -webkit-backdrop-filter: blur(22px) saturate(220%) contrast(1.12);
                  backdrop-filter: blur(22px) saturate(220%) contrast(1.12);
                }
                .menu-item-has-submenu:hover > .menu-list {
                    display: block;
                }
                .menu-link {
                  color: #0b1220;
                    display: block;
                    font-size: .75rem;
                    line-height: 1rem;
                    padding: .5rem 1rem;
                    text-decoration: none;
                  text-shadow: 0 1px 1px rgba(255, 255, 255, .75);
                  transition: background .2s ease, color .2s ease, transform .2s ease;
                }
                .menu-link-root {
                    font-weight: 700;
                }
                .menu-link:hover {
                  background: rgba(255, 255, 255, .52);
                  border-radius: 1rem;
                  color: #020617;
                  transform: translateX(2px);
                }
            `}</style>
      <Submenu items={items} />
    </nav>
  );
}

export default Menu;
