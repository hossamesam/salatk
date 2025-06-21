import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch } from '@/hooks/hooks';
import { choiceCityAndCountry, choiceCoords } from '@/redux/salatimes/CountrySelectorSlice';
import { ICountrySelectAPI } from '@/types/CountrySelectAPI';
import { DialogClose } from '@radix-ui/react-dialog';
import axios from 'axios';
import React, { useState, useMemo, useEffect } from 'react'
import Select from 'react-select'
import countryList from 'react-select-country-list'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// يمكنك وضع صورة مخصصة أو استخدام صورة افتراضية من الإنترنت أو من مجلد public
const customIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // مثال: أيقونة خضراء
    iconSize: [40, 40], // حجم العلامة
    iconAnchor: [20, 40], // نقطة الارتكاز
    popupAnchor: [0, -40],
    shadowUrl: undefined,
    shadowSize: undefined,
    shadowAnchor: undefined,
});

function CountrySelector() {
    const dispatch = useAppDispatch();
    const [value, setValue] = useState<{ value: string; label: string } | null>(null)
    const [mode, setMode] = useState<'location' | 'coords'>('location');
    const [country, setcountry] = useState<{ value: string, label: string }[] | undefined>();
    const [countryvalue, setcountryvalue] = useState<{ value: string; label: string } | null>(null);
    const [mapCoords, setMapCoords] = useState<[number, number] | null>(null);
    const options = useMemo(() => countryList().getData(), [])

    const changeHandler = (value: { value: string; label: string } | null) => {
        setValue(value)
    }

    const changecountry = (value: { value: string; label: string } | null) => {
        setcountryvalue(value)
    }

    useEffect(() => {
        if (value) {
            axios<ICountrySelectAPI>('https://countriesnow.space/api/v0.1/countries/cities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                data: { country: value.label }
            })
                .then((res) => {
                    const mapResponse: { value: string, label: string }[] = res.data.data.map((item) => {
                        return { value: item, label: item }
                    })
                    setcountry(mapResponse)
                })
                .catch(err => console.log("err =>", err)) // هنا ستجد قائمة المحافظات/المدن
        }
    }, [value])
    const handlerContryorCoords = (datasumit: React.FormEvent<HTMLFormElement>) => {
        datasumit.preventDefault();
        if (mode === 'location' && value && countryvalue) {
            dispatch(choiceCityAndCountry({ city: countryvalue.label, country: value.label }))
        } else {
            const latitude = (datasumit.currentTarget.elements.namedItem('latitude') as HTMLInputElement)?.value;
            const longitude = (datasumit.currentTarget.elements.namedItem('longitude') as HTMLInputElement)?.value;
            dispatch(choiceCoords({ latitude: Number(latitude), longitude: Number(longitude) }))
        }
    }

    function LocationMap({ onSelect, position }: { onSelect: (coords: [number, number]) => void, position: [number, number] | null }) {
        useMapEvents({
            click(e) {
                onSelect([e.latlng.lat, e.latlng.lng]);
            },
        });

        // تحقق أن الإحداثيات ليست undefined أو NaN أو صفر
        const isValid =
            position &&
            !isNaN(position[0]) &&
            !isNaN(position[1]) &&
            position[0] !== 0 &&
            position[1] !== 0;

        return isValid ? <Marker position={position} icon={customIcon} /> : null;
    }

    return (
        <div className="w-full   mx-auto ">

            <div className="flex justify-center mb-4 gap-2">
                <button className={`px-4 py-2  rounded ${mode === 'location' ? 'bg-emerald-600 text-white ' : 'bg-gray-200 cursor-pointer'}`} onClick={() => setMode('location')}>دولة/محافظة</button>
                <button className={`px-4 py-2 rounded ${mode === 'coords' ? 'bg-emerald-600 text-white' : 'bg-gray-200 cursor-pointer'}`} onClick={() => setMode('coords')}>إحداثيات</button>
            </div>
            <form onSubmit={handlerContryorCoords} className="flex  flex-col">

                {mode === 'location' ? (
                    <div>
                        <Select name="country" className='my-2' placeholder={"اختر دولة"} options={options} value={value} onChange={changeHandler} />
                        <Select name="city" isDisabled={!country} className='my-2' placeholder={"اختر المحافظة"} options={country} value={countryvalue} onChange={changecountry} />
                    </div>
                ) : (
                    <div>
                        <div className='flex flex-row gap-2 max-lg:grid max-lg:grid-cols-2 '>
                            <div className='flex w-full'>
                                <label className='p-2 text-nowrap max-lg:hidden ' htmlFor="Latitude">خط العرض (Latitude)</label>
                                <Input
                                    name="latitude"
                                    type="text"
                                    pattern="-?[0-9]*\.?[0-9]+"
                                    className="w-full mb-2 p-2 border rounded"
                                    placeholder="خط العرض (Latitude)"
                                    value={mapCoords ? mapCoords[0] : ''}
                                    onChange={e => setMapCoords([Number(e.target.value), mapCoords ? mapCoords[1] : 0])}
                                />
                            </div>
                            <div className='inline-flex w-full '>
                                <label className='p-2 text-nowrap max-lg:hidden ' htmlFor="Longitude">خط الطول (Longitude) </label>
                                <Input
                                    name="longitude"
                                    type="text"
                                    pattern="-?[0-9]*\.?[0-9]+"
                                    className="w-full mb-4 p-2 border rounded"
                                    placeholder="خط الطول (Longitude)"
                                    value={mapCoords ? mapCoords[1] : ''}
                                    onChange={e => setMapCoords([mapCoords ? mapCoords[0] : 0, Number(e.target.value)])}
                                />
                            </div>

                        </div>
                        <div className="min-xl:h-[500px] max-xl:h-[300px]" >
                            <MapContainer center={[30.033879101138215, 31.19104385375977]} zoom={5} className='w-full h-full'>
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <LocationMap onSelect={setMapCoords} position={mapCoords} />
                            </MapContainer>
                        </div>


                    </div>
                )}
                <div className='flex justify-between '>
                    <Button type='submit' className="cursor-pointer bg-emerald-600 text-white py-2 rounded font-bold">احسب المواقيت</Button>
                    <DialogClose asChild>
                        <Button type="button" variant="default" className="cursor-pointer" >
                            Close
                        </Button>
                    </DialogClose>
                </div>
            </form>

        </div>
    )
}

export default CountrySelector