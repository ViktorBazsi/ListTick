import { Formik, Form, Field, ErrorMessage } from "formik";
import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import {
  userValidationSchemaForLoginEmail,
  userValidationSchemaForLoginName,
} from "../schema/userValidationSchema";

export default function LoginForm() {
  const { login, authMsg, showAuthMsg } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirectTo = searchParams.get("redirect") || "/";

  const handleSubmit = async (values, { setSubmitting }) => {
    const { identifier, password } = values;

    // Megvizsgáljuk, e-mail címet vagy usernevet írt-e be
    const credentials = identifier.includes("@")
      ? { email: identifier, password }
      : { username: identifier, password };

    const result = await login(credentials);

    setSubmitting(false);
    if (result.ok) {
      navigate(redirectTo); // ⬅️ ide megy vissza, ahonnan érkezett
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg mt-12 mb-24">
      <h2 className="text-2xl font-bold text-center mb-6">Bejelentkezés</h2>

      {authMsg.show && (
        <div
          className={`text-sm text-center mb-4 font-medium ${
            authMsg.success ? "text-green-600" : "text-red-600"
          }`}
        >
          {authMsg.msg}
        </div>
      )}

      <Formik
        initialValues={{ identifier: "", password: "" }}
        validate={async (values) => {
          const { identifier, password } = values;
          let schema;

          // Konstruáljuk meg a schema inputját (email vs username szerint)
          const schemaValues = identifier.includes("@")
            ? { email: identifier, password }
            : { username: identifier, password };

          schema = identifier.includes("@")
            ? userValidationSchemaForLoginEmail
            : userValidationSchemaForLoginName;

          try {
            await schema.validate(schemaValues, { abortEarly: false });
            return {}; // nincs hiba
          } catch (err) {
            const errors = {};
            err.inner.forEach((validationError) => {
              // Térképezzük át username/email → identifier
              if (["username", "email"].includes(validationError.path)) {
                errors.identifier = validationError.message;
              } else {
                errors[validationError.path] = validationError.message;
              }
            });
            return errors;
          }
        }}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6">
            <div>
              <label className="block mb-1 font-semibold">
                Felhasználónév vagy e-mail
              </label>
              <Field
                name="identifier"
                type="text"
                placeholder="pl. kukori vagy kukori@email.com"
                className="w-full border border-gray-300 rounded-xl px-4 py-2"
              />
              <ErrorMessage
                name="identifier"
                component="div"
                className="text-red-600 text-sm mt-1"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Jelszó</label>
              <Field
                name="password"
                type="password"
                placeholder="Jelszó"
                className="w-full border border-gray-300 rounded-xl px-4 py-2"
              />{" "}
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-600 text-sm mt-1"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white rounded-xl px-4 py-2 font-semibold hover:bg-gray-800 transition"
            >
              Bejelentkezés
            </button>

            <div className="text-center mt-4 text-sm text-gray-600">
              Nincs még profilod?{" "}
              <Link
                to={`/register`}
                onClick={() => showAuthMsg(false)}
                className="text-black font-medium hover:underline"
              >
                Regisztrálj!
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
