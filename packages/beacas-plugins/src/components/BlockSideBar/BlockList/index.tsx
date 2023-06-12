import { Card, Collapse, Empty, Grid, Space } from "@arco-design/web-react";
import { IconFont } from "@beacas-plugins/components/IconFont";
import { useDragging } from "@beacas-plugins/hooks";
import { BlockManager, Element, ElementType, t } from "beacas-core";
import { useEditorProps, useEditorState } from "beacas-editor";
import React, { useMemo } from "react";
import { BlockItem } from "../BlockItem";
import { LayoutItem } from "../LayoutItem";
import "./index.scss";
import { ThemeConfigProps } from "@beacas-plugins/typings";

const defaultCategories: ThemeConfigProps["categories"] = [
  {
    get label() {
      return t("Content");
    },
    active: true,
    displayType: "grid",
    blocks: [
      {
        type: ElementType.STANDARD_PARAGRAPH,
        icon: (
          <IconFont
            className={"block-list-grid-item-icon"}
            iconName="icon-text"
          />
        ),
      },
      {
        type: ElementType.STANDARD_IMAGE,
        payload: {
          attributes: {
            "padding-top": "0px",
            "padding-bottom": "0px",
            "padding-left": "0px",
            "padding-right": "0px",
          },
        },
        icon: (
          <IconFont
            className={"block-list-grid-item-icon"}
            iconName="icon-img"
          />
        ),
      },
      {
        type: ElementType.STANDARD_BUTTON,
        icon: (
          <IconFont
            className={"block-list-grid-item-icon"}
            iconName="icon-button"
          />
        ),
        payload: {
          attributes: {
            "line-height": "130%",
          },
        },
      },
      {
        type: ElementType.STANDARD_DIVIDER,
        icon: (
          <IconFont
            className={"block-list-grid-item-icon"}
            iconName="icon-divider"
          />
        ),
        payload: {
          attributes: {
            "border-width": "1px",
            "border-style": "solid",
            "border-color": "#C9CCCF",
            "padding-top": "10px",
            "padding-right": "0px",
            "padding-bottom": "10px",
            "padding-left": "0px",
          },
        },
      },
      {
        type: ElementType.STANDARD_SPACER,
        icon: (
          <IconFont
            className={"block-list-grid-item-icon"}
            iconName="icon-spacing"
          />
        ),
      },
      {
        type: ElementType.STANDARD_NAVBAR,
        icon: (
          <IconFont
            className={"block-list-grid-item-icon"}
            iconName="icon-navbar"
          />
        ),
        payload: {
          children: [
            {
              data: {},
              type: "standard-navbar-link",
              children: [
                {
                  text: "Shop",
                },
              ],
              attributes: {
                href: "",
                "font-size": "20px",
              },
            },
            {
              data: {},
              type: "standard-navbar-link",
              children: [
                {
                  text: "About",
                },
              ],
              attributes: {
                href: "",
                "font-size": "20px",
              },
            },
            {
              data: {},
              type: "standard-navbar-link",
              children: [
                {
                  text: "Contact",
                },
              ],
              attributes: {
                href: "",
                "font-size": "20px",
              },
            },
            {
              data: {},
              type: "standard-navbar-link",
              children: [
                {
                  text: "Blog",
                },
              ],
              attributes: {
                href: "",
                "font-size": "20px",
              },
            },
          ],
        },
      },
      {
        type: ElementType.STANDARD_SOCIAL,
        icon: (
          <IconFont
            className={"block-list-grid-item-icon"}
            iconName="icon-social"
          />
        ),
        payload: {
          type: "standard-social",
          data: {},
          attributes: {
            "icon-size": "30px",
            spacing: "20px",
          },
          children: [
            {
              data: {},
              type: "standard-social-element",
              children: [
                {
                  text: "",
                },
              ],
              attributes: {
                src: "https://res.cloudinary.com/dfite2e16/image/upload/v1681908489/clgnivsuj0018z9ltiixmxf6k/xkd0kfnytbfywsofk8t6.png",
                href: "",
                "padding-left": "0px",
                "padding-right": "0px",
                "padding-top": "0px",
                "padding-bottom": "0px",
              },
            },
            {
              data: {},
              type: "standard-social-element",
              children: [
                {
                  text: "",
                },
              ],
              attributes: {
                src: "https://res.cloudinary.com/dfite2e16/image/upload/v1681908521/clgnivsuj0018z9ltiixmxf6k/ulyduaza1votoacctoi3.png",
                href: "",
                "padding-left": "20px",
                "padding-right": "0px",
                "padding-top": "0px",
                "padding-bottom": "0px",
              },
            },
            {
              data: {},
              type: "standard-social-element",
              children: [
                {
                  text: "",
                },
              ],
              attributes: {
                src: "https://res.cloudinary.com/dfite2e16/image/upload/v1681908543/clgnivsuj0018z9ltiixmxf6k/wtefhsfwaapcdbz7knqw.png",
                href: "",
                "padding-left": "20px",
                "padding-right": "0px",
                "padding-top": "0px",
                "padding-bottom": "0px",
              },
            },
          ],
        },
      },
      {
        type: ElementType.STANDARD_HERO,
        icon: (
          <IconFont
            className={"block-list-grid-item-icon"}
            iconName="icon-hero"
          />
        ),
      },
      {
        type: ElementType.MARKETING_SHOPWINDOW,
        icon: (
          <IconFont
            className={"block-list-grid-item-icon"}
            iconName="icon-bag"
          />
        ),
      },
    ],
  },
  {
    get label() {
      return t("Layout");
    },
    active: true,
    displayType: "column",
    blocks: [
      {
        get title() {
          return t("1 column");
        },
        payload: [["100%"]],
      },
      {
        get title() {
          return t("2 column");
        },
        payload: [
          ["50%", "50%"],
          ["33%", "67%"],
          ["67%", "33%"],
          ["25%", "75%"],
          ["75%", "25%"],
        ],
      },
      {
        get title() {
          return t("3 column");
        },
        payload: [
          ["33.33%", "33.33%", "33.33%"],
          ["25%", "50%", "25%"],
          ["25%", "25%", "50%"],
          ["50%", "25%", "25%"],
        ],
      },
      {
        get title() {
          return t("4 column");
        },
        payload: [["25%", "25%", "25%", "25%"]],
      },
    ],
  },
];

export const BlockList = ({ tab }: { tab: "Default" | "Universal" }) => {
  const { universalElementEditing } = useEditorState();
  if (universalElementEditing) {
    return (
      <div>
        <DefaultBlockList />
      </div>
    );
  }
  return (
    <>
      <div style={{ display: tab === "Default" ? undefined : "none" }}>
        <DefaultBlockList />
      </div>
      <div style={{ display: tab === "Universal" ? undefined : "none" }}>
        <UniversalList />
      </div>
    </>
  );
};

const DefaultBlockList = () => {
  const editorProps = useEditorProps();
  const { universalElementEditing } = useEditorState();
  const categories = editorProps.categories || defaultCategories;

  const defaultActiveKey = useMemo(
    () => [
      ...categories
        .filter((item) => item.active)
        .map((item, index) => index.toString()),
    ],
    [categories]
  );

  return (
    <div>
      <Collapse defaultActiveKey={defaultActiveKey}>
        {categories.map((category, index) => {
          if (category.displayType === "grid") {
            return (
              <Collapse.Item
                key={index}
                contentStyle={{ padding: "20px 20px" }}
                name={index.toString()}
                header={category.label}
              >
                <div className="block-list-grid">
                  {category.blocks.map((item, index) => {
                    return <BlockItem key={index} {...item} />;
                  })}
                </div>
              </Collapse.Item>
            );
          }

          if (category.displayType === "column" && !universalElementEditing) {
            return (
              <Collapse.Item
                key={index}
                contentStyle={{ padding: "0px 20px" }}
                name={index.toString()}
                header={category.label}
              >
                <Space direction="vertical">
                  <div />
                </Space>
                <Collapse defaultActiveKey={[category.blocks[0]?.title || ""]}>
                  {category.blocks.map((item) => (
                    <LayoutItem
                      key={item.title}
                      title={item.title || ""}
                      columns={item.payload}
                    />
                  ))}
                </Collapse>

                <Space direction="vertical">
                  <div />
                </Space>
              </Collapse.Item>
            );
          }

          if (category.displayType === "custom" && !universalElementEditing) {
            return (
              <Collapse.Item
                key={index}
                contentStyle={{ padding: 0 }}
                name={index.toString()}
                header={category.label}
              >
                <Grid.Row>
                  {category.blocks.map((item, index) => {
                    return <React.Fragment key={index}>{item}</React.Fragment>;
                  })}
                </Grid.Row>
              </Collapse.Item>
            );
          }

          return null;
        })}
      </Collapse>
    </div>
  );
};

const UniversalList = () => {
  const { universalElementSetting } = useEditorProps();

  if (!universalElementSetting) return null;
  return (
    <Collapse defaultActiveKey={["0"]}>
      {universalElementSetting.list.map((item, index) => {
        return (
          <Collapse.Item
            key={index}
            header={item.label}
            name={index.toString()}
            contentStyle={{ padding: "20px" }}
          >
            <Space size="large" direction="vertical" style={{ width: "100%" }}>
              {item.elements.length === 0 && (
                <Empty description={t("No Element")} />
              )}
              {item.elements.map((child, index) => {
                if (!child.element.uid) {
                  throw new Error("Universal element must have a uid");
                }
                const childItem =
                  universalElementSetting.elements[child.element.uid];

                if (!childItem) {
                  throw new Error(
                    `Cannot find universal element by uid ${child.element.uid}`
                  );
                }

                return (
                  <UniversalListItem
                    element={childItem}
                    key={index}
                    thumbnail={child.thumbnail}
                  />
                );
              })}
            </Space>
          </Collapse.Item>
        );
      })}
    </Collapse>
  );
};

const UniversalListItem = ({
  element,
  thumbnail,
}: {
  element: Element;
  thumbnail: string;
}) => {
  const { dragHandle } = useDragging({
    element: element,
    nodeElement: null,
    action: "copy",
  });

  return (
    <Card
      {...dragHandle}
      style={{ cursor: "grab" }}
      title={BlockManager.getBlockTitle(element)}
    >
      <div
        style={{
          backgroundImage: `url(${thumbnail})`,
          height: 120,
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      ></div>
    </Card>
  );
};
