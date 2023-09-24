import Switch from "@/components/ui/buttons/toggle.button"

interface Props {
    showMarkers: boolean;
    setShowMarkers: (showMarkers: boolean) => void;
}

const OrderOverlayToggle: React.FC<Props> = ({showMarkers, setShowMarkers}) => {
    return (
        <div className="flex flex-col w-fit gap-2">
            <p>Show orders on graph</p>
            <div className="ml-auto">
            <Switch
                isContinuous={showMarkers}
                onToggle={() => setShowMarkers(!showMarkers)}
            />
            </div>
        </div>
    )
}

export default OrderOverlayToggle