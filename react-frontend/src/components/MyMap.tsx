import { useState, useRef, Fragment } from 'react';
import {fromLonLat} from 'ol/proj';
import {Point} from 'ol/geom';
import {Feature} from 'ol';
import 'ol/ol.css';
import './MyMap.css'
//import { Route } from "../utils/models";

import {RMap, ROSM, RLayerVector, RStyle, RFeature, ROverlay} from 'rlayers';

/*interface MyMapProps {
    route: Route | null
}*/

const monument = '/monument.svg';

let unique_id = 0;

//const MyMap = ({route}: MyMapProps) => {
const MyMap = () => {
    // The features must be part of the state as they will be modified
    const [features, setFeatures] = useState([] as Feature[]);
    const vectorRef = useRef() as React.RefObject<RLayerVector>;
    
    return (
        <Fragment>
            <RMap
                className='example-map'
                initial={{center: fromLonLat([-47.925144, -15.829519]), zoom: 17}}
                onClick={(e) => {
                    const coords = e.map.getCoordinateFromPixel(e.pixel);
                    features.push(new Feature({geometry: new Point(coords), uid: unique_id++}));
                    // Why not setFeatures(features) ?
                    // Because it won't have any effect -
                    // unless you artificially create a new array
                    // React won't know that something changed
                    setFeatures([...features]);
                }}
            >
                <ROSM />

                <RLayerVector ref={vectorRef}>
                    <RStyle.RStyle>
                        <RStyle.RIcon src={monument} />
                    </RStyle.RStyle>
                    {features.map((f) => (
                        <RFeature
                            // This is the very important part: if we are going to be
                            // adding or deleting features, we must have a key field
                            // that won't be transient - we can't use the array index, as
                            // it will change every time we delete a feature in the middle
                            key={f.get('uid')}
                            feature={f}
                            onClick={(e) => {
                                // This the deletion
                                const idx = features.findIndex(
                                    (x) => x.get('uid') === e.target.get('uid')
                                );
                                if (idx >= 0) {
                                    features.splice(idx, 1);
                                    setFeatures([...features]);
                                    // It is very important to return false to stop the
                                    // event propagation - otherwise that same event will
                                    // also trigger the Map onClick
                                    return false;
                                }
                            }}
                        >
                            <ROverlay>
                                <div className={'user-select-none'}>{f.get('uid')}</div>
                            </ROverlay>
                        </RFeature>
                    ))}
                </RLayerVector>
            </RMap>
            <div className='mx-0 mt-0 mb-3 p-1 w-100 jumbotron shadow shadow'>
                <p>Click an empty space to add a monument or click a monument to delete it.</p>
            </div>
        </Fragment>
    );
}

export default MyMap;
