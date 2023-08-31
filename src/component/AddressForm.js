import React, { useEffect, useRef } from "react";
import "./home.scss";

import useGooglePlaceAutoComplete from "../service/googlePlaceAutocomplete";

// all args besides centerMap are spread from react-hook-form's useForm
const AddressForm = ({ handleSubmit, register, setFocus, setValue, formState = {}, centerMap }) => {

  const address1Ref = useRef();
  const googleAutoCompleteSvc = useGooglePlaceAutoComplete();
  let autoComplete = "";

  const { errors } = formState;

  const handleAddressSelect = async () => {
    let addressObj = await googleAutoCompleteSvc.getFullAddress(autoComplete);
    console.log(">> addressObj : ", addressObj);
    address1Ref.current.value = addressObj.address1;
    setValue("address1", addressObj.address1);
    setValue("locality", `${addressObj.locality}, ${addressObj.adminArea1Long}`);
    setValue("country", addressObj.countryLong);
    setValue("postalCode", addressObj.postalCode);
    setValue("location", addressObj.location)
    setFocus("address2");
  };

  const onSubmit = (value) => {
    console.log("Success!", { value, formState });
    centerMap(value.location);
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <p>Renseigner l'adresse :</p>
      <div className="address-container">
        <div className="form-field-container">
          <label>Address 1 (Required)</label>
          <input
            id="address1"
            type="text"
            className="form-field"
            placeholder="123 Rue blabla"
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
              placeholder="Rennes, Bretagne"
              {...register("locality", { required: true })}
          />
          {errors.locality && <span className="validation-error">Error: Locality is required.</span>}
        </div>
        <div className="form-field-container">
          <div className="short-form-field-container">
            <div>
              <label>Pays (Requis)</label>
              <input
                type="text"
                className="short-form-field"
                placeholder="France"
                {...register("country", { required: true })}
              />
            </div>
            <div>
              <label>Code Postal (Requis)</label>
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
  );
}

export default AddressForm;