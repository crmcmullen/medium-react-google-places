import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import "./home.scss";

import useGooglePlaceAutoComplete from "../service/google_place_autocomplete";

function Home() {

    const address1Ref = useRef();
    const googleAutoCompleteSvc = useGooglePlaceAutoComplete();
    let autoComplete = "";

    const { handleSubmit, register, setFocus, setValue, formState: { errors } } = useForm({});

    const handleAddressSelect = async () => {
        let addressObj = await googleAutoCompleteSvc.getFullAddress(autoComplete);
        address1Ref.current.value = addressObj.address1;
        setValue("address1", addressObj.address1);
        setValue("location", `${addressObj.locality}, ${addressObj.adminArea1Long}`);
        setValue("country", addressObj.countryLong);
        setValue("postalCode", addressObj.postalCode);
        setFocus("address2");
    };

    const onSubmit = () => {
        console.log("Success!");
    };

    useEffect(() => {
        async function loadGoogleMaps() {
            // initialize the Google Place Autocomplete widget and bind it to an input element.
            // eslint-disable-next-line
            autoComplete = await googleAutoCompleteSvc.initAutoComplete(address1Ref.current, handleAddressSelect);
        }
        loadGoogleMaps();
    }, []);

    return (
        <div className="container">
            <form onSubmit={handleSubmit(onSubmit)}>
                <p>Enter Address:</p>
                <div className="address-container">
                    <div className="form-field-container">
                        <label>Address 1 (Required)</label>
                        <input
                            id="address1"
                            type="text"
                            className="form-field"
                            placeholder="123 W Street Rd"
                            {...register("address1", { required: true })}
                            ref={address1Ref}
                        />
                        {errors.address1 && <span className="validation-error">Error: Street address is required.</span>}
                    </div>
                    <div className="form-field-container">
                        <label>Address 2</label>
                        <input
                            type="text"
                            className="form-field"
                            placeholder="Suite 123"
                            {...register("address2")}
                        />
                    </div>
                    <div className="form-field-container">
                        <label>City, State/Province (Required)</label>
                        <input
                            type="text"
                            className="form-field"
                            placeholder="Anytown, Idaho"
                            {...register("location", { required: true })}
                        />
                        {errors.location && <span className="validation-error">Error: Location is required.</span>}
                    </div>
                    <div className="form-field-container">
                        <div className="short-form-field-container">
                            <div>
                                <label>Country (Required)</label>
                                <input
                                    type="text"
                                    className="short-form-field"
                                    placeholder="United States"
                                    {...register("country", { required: true })}
                                />
                            </div>
                            <div>
                                <label>Postal Code (Required)</label>
                                <input
                                    type="text"
                                    className="short-form-field"
                                    placeholder="12345-6789"
                                    {...register("postalCode", { required: true })}
                                />
                            </div>
                        </div>
                        {errors.country && <span className="validation-error">Error: Country is required.</span>}
                        {errors.postalCode && <span className="validation-error">Error: Postal code is required.</span>}
                    </div>
                </div>
                <div className="button-container">
                    <button 
                        type="submit" 
                        className="button-primary" 
                    >Submit</button>
                </div>
            </form>
        </div>
    );
}

export default Home;