import React, { useEffect } from "react";
import * as RFF from "react-final-form";
import { Utils } from '../../utils';
import { IFormModel, IFormService } from "../../services/formService";
import { useService } from "inversify-hooks";
import { useTranslation } from "react-i18next";
import Styles from "./Styles";

const Form = () => {
  const { t } = useTranslation();
  const nameof = Utils.nameofFactory<IFormModel>();
  const formService = useService<IFormService>("FormService");

  const resource = Utils.createResource<undefined, IFormModel>({name: 'getData', callback: () => formService.getData()})
  const initialValues = resource.read(undefined);

  useEffect(() => {
    return Utils.cleanResource();
  }, [])
  
  const onHandleSubmit = async (values: IFormModel) => {
    formService.saveData(values);
  };

  return (
    <Styles>
      <RFF.Form
        onSubmit={onHandleSubmit}
        initialValues={initialValues}
        subscription={{ pristine: true, submitting: true }}
        render={({ handleSubmit, pristine, form, submitting, values }) => {
          return (
            <form onSubmit={handleSubmit}>
              <div>
                <label>{t('userName')}</label>
                <RFF.Field
                  name={nameof("userName")}
                  component="input"
                  placeholder="Username"
                />
              </div>
              <div>
                <label>{t('firstName')}</label>
                <RFF.Field
                  name={nameof("firstName")}
                  component="input"
                  placeholder="First Name"
                />
              </div>
              <div className="buttons">
                <button type="submit" disabled={submitting || pristine}>
                  {t('submit')}
                </button>
                <button
                  type="button"
                  onClick={form.reset}
                  disabled={submitting || pristine}
                >
                  {t('reset')}
                </button>
              </div>
              <RFF.FormSpy subscription={{ values: true }}>
                {({ values }) => (<pre>{JSON.stringify(values)}</pre>)}
              </RFF.FormSpy>
            </form>
          );
        }}
      />
    </Styles>
  );
};

export default Form;