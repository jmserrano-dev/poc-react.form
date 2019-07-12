import React from "react";
import * as RFF from "react-final-form";
import { Utils } from '../../utils';
import { IFormModel, IFormService, SERVICE_NAME } from "../../services/formService";
import { useService } from "inversify-hooks";
import { useTranslation } from "react-i18next";
import Styles from "./Styles";
import useResource from '../../utils/useResource';

const Form = () => {
  const { t } = useTranslation();
  const nameofModel = Utils.nameofFactory<IFormModel>();
  const nameofService = Utils.nameofFactory<IFormService>();
  const formService = useService<IFormService>(SERVICE_NAME);

  const initialValues = useResource<IFormModel>({
    identifier: nameofService("getData"),
    callback: () => formService.getData()
  });

  const onHandleSubmit = async (values: IFormModel) => {
    return formService.saveData(values);
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
                  name={nameofModel("userName")}
                  component="input"
                  placeholder="Username"
                />
              </div>
              <div>
                <label>{t('firstName')}</label>
                <RFF.Field
                  name={nameofModel("firstName")}
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