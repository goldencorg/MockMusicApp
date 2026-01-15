import Image from 'next/image';

export default function AlternativeChoices() {
    return (
        <div className="overflow-hidden">
            <div className="pb-2">
                <h6 className="text-gray-500 font-bold mb-2">Music</h6>
                <MenuItem icon="/icons/home.svg" label="Home" />
                <MenuItem icon="/icons/trending.svg" label="Trending" />
                <MenuItem icon="/icons/radio.svg" label="Radio" />
            </div>
            <div className="pb-2">
                <h6 className="text-gray-500 font-bold mb-2">Library</h6>
                <MenuItem icon="/icons/song.svg" label="Songs" />
                <MenuItem icon="/icons/album.svg" label="Albums" />
                <MenuItem icon="/icons/artist.svg" label="Artists" />
            </div>
        </div>
    )
}

function MenuItem({ icon, label }: { icon: string, label: string }) {
    return (
        <div className="text-xl flex flex-row items-center py-1 hover:bg-gray-100 rounded cursor-pointer">
            <div className="pl-4">
                <Image src={icon} alt={label} width={17} height={17} />
            </div>
            <div className="pl-4">{label}</div>
        </div>
    )
}