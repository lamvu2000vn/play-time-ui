import {Item, PaidItem} from "@/helpers/shared/interfaces/commonInterface";
import {useEffect, useState} from "react";
import TabsContainer from "../../UI/TabsContainer";
import ConfirmBuyItemModal from "@/components/UI/Modal/ConfirmBuyItemModal";
import AvatarItem from "./AvatarItem";
import {useTranslations} from "next-intl";

interface Props {
    itemList: Item[];
    paidItems: PaidItem[];
    itemSection: string | null;
}

type TabActive = "allItems" | "paidItems";

export default function AvatarSection(props: Props) {
    const {itemList, itemSection, paidItems} = props;
    const [tabActive, setTabActive] = useState<TabActive>("allItems");
    const [showConfirmBuyItemModal, setShowConfirmBuyItemModal] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const pageTranslation = useTranslations("page.store");

    const handleChangeTab = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTabActive(e.currentTarget.value as TabActive);
    };

    const handleClickItem = (item: Item) => {
        setSelectedItem(item);
        setShowConfirmBuyItemModal(true);
    };

    const allItemsChecked = tabActive === "allItems";
    const paidItemsChecked = tabActive === "paidItems";

    useEffect(() => {
        if (itemSection) {
            const tabActiveArr: string[] = ["allItems", "paidItems"];

            if (tabActiveArr.includes(itemSection)) {
                setTabActive(itemSection as TabActive);
            }
        }
    }, [itemSection]);

    return (
        <>
            <TabsContainer>
                <TabsContainer.TabItems>
                    <TabsContainer.Tab
                        value="allItems"
                        checked={allItemsChecked}
                        onChange={handleChangeTab}
                        label={pageTranslation("tab.notOwnedLabel")}
                    />
                    <TabsContainer.Tab
                        value="paidItems"
                        checked={paidItemsChecked}
                        onChange={handleChangeTab}
                        label={`${pageTranslation("tab.ownedLabel")} (${paidItems.length}/${itemList.length})`}
                    />
                </TabsContainer.TabItems>
                <TabsContainer.TabContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {tabActive === "allItems"
                            ? itemList.map((item) => (
                                  <AvatarItem key={item._id} item={item} showPrice onClick={handleClickItem} />
                              ))
                            : tabActive === "paidItems"
                            ? paidItems.map((paidItem) => <AvatarItem key={paidItem._id} item={paidItem.itemId} />)
                            : null}
                    </div>
                </TabsContainer.TabContent>
            </TabsContainer>
            <ConfirmBuyItemModal
                show={showConfirmBuyItemModal}
                onClose={() => setShowConfirmBuyItemModal(false)}
                item={selectedItem}
                type="avatar"
            />
        </>
    );
}
