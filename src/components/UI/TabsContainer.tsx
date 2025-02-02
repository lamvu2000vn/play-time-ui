export default function TabsContainer({children}: {children: React.ReactNode}) {
    return <div className="w-full flex flex-col item-stretch gap-8">{children}</div>;
}

function TabItems({children}: {children: React.ReactNode}) {
    return (
        <div className="w-full">
            <div className="w-full flex items-stretch overflow-auto">{children}</div>
        </div>
    );
}

function Tab({
    label,
    value,
    checked,
    onChange,
}: {
    label: string;
    value: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <div className="flex-1 flex-shrink-0">
            <input
                type="radio"
                hidden
                name="tab"
                id={value}
                className="peer"
                value={value}
                checked={checked}
                onChange={onChange}
            />
            <label
                htmlFor={value}
                className="cursor-pointer block text-nowrap p-3 rounded-tl-lg rounded-tr-lg border-b-4 border-gray-400/70 peer-checked:font-semibold peer-checked:text-primary peer-checked:border-primary"
            >
                <div className="text-base text-center">{label}</div>
            </label>
        </div>
    );
}

function TabContent({children}: {children: React.ReactNode}) {
    return <div>{children}</div>;
}

TabsContainer.TabItems = TabItems;
TabsContainer.Tab = Tab;
TabsContainer.TabContent = TabContent;
