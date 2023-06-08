import { useAdminResetPassword } from "medusa-react"
import qs from "qs"
import { useForm } from "react-hook-form"
import { decodeToken } from "react-jwt"
import { useLocation, useNavigate } from "react-router-dom"
import InputError from "../components/atoms/input-error"
import Button from "../components/fundamentals/button"
import SigninInput from "../components/molecules/input-signin"
import SEO from "../components/seo"
import PublicLayout from "../components/templates/login-layout"
import useNotification from "../hooks/use-notification"
import { getErrorMessage } from "../utils/error-messages"
import FormValidator from "../utils/form-validator"

type formValues = {
  password: string
  repeat_password: string
}

const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const parsed = qs.parse(location.search.substring(1))

  let token: { email: string } | null = null
  if (parsed?.token) {
    try {
      token = decodeToken(parsed.token as string)
    } catch (e) {
      token = null
    }
  }

  const email = (token?.email || parsed?.email || "") as string

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<formValues>({
    defaultValues: {
      password: "",
      repeat_password: "",
    },
  })
  const reset = useAdminResetPassword()
  const notification = useNotification()

  const onSubmit = handleSubmit((data: formValues) => {
    if (data.password !== data.repeat_password) {
      setError(
        "repeat_password",
        {
          type: "manual",
          message: "Paroolid ei kattu",
        },
        {
          shouldFocus: true,
        }
      )
      return
    }

    reset.mutate(
      {
        token: parsed.token as string,
        password: data.password,
        email: email,
      },
      {
        onSuccess: () => {
          navigate("/login")
        },
        onError: (err) => {
          notification("Viga", getErrorMessage(err), "error")
        },
      }
    )
  })

  return (
    <PublicLayout>
      <SEO title="Muuda parooli" />
      <div className="flex flex-col items-center justify-center">
        {token ? (
          <form onSubmit={onSubmit}>
            <div className="gap-y-large flex flex-col items-center">
              <h1 className="inter-xlarge-semibold">Muuda parooli</h1>
              <div className="gap-y-small flex flex-col items-center">
                <SigninInput
                  placeholder="Mail"
                  disabled
                  readOnly
                  value={email}
                />
                <div>
                  <SigninInput
                    placeholder="Parool (8+ tähemärki)"
                    type="password"
                    {...register("password", {
                      required: FormValidator.required("Parool"),
                    })}
                  />
                  <InputError errors={errors} name="password" />
                </div>
                <div>
                  <SigninInput
                    placeholder="Kinnita parool"
                    type="password"
                    {...register("repeat_password", {
                      required: "Peate oma parooli kinnitama",
                    })}
                  />
                  <InputError errors={errors} name="repeat_password" />
                </div>
              </div>
              <Button variant="secondary" size="medium" className="w-[280px]">
                Muuda parooli
              </Button>
              <a
                href="/login"
                className="inter-small-regular text-grey-40 mt-xsmall"
              >
                Tagasi sisse logima.
              </a>
            </div>
          </form>
        ) : (
          <div className="gap-y-large flex flex-col items-center">
            <div className="gap-y-xsmall flex flex-col text-center">
              <h1 className="inter-xlarge-semibold text-[20px]">
                Taastamise link on vale
              </h1>
              <p className="text-grey-50 inter-base-regular">
                Proovi enda parool uuesti taastada.
              </p>
            </div>
            <a href="/login?reset-password=true">
              <Button variant="secondary" size="medium" className="w-[280px]">
                Parooli muutmine
              </Button>
            </a>
          </div>
        )}
      </div>
    </PublicLayout>
  )
}

export default ResetPasswordPage
