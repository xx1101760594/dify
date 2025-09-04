const Title = ({
  title,
}: {
  title: string
}) => {
  return (
    <div className='system-md-semibold truncate text-text-secondary text-base'>
      {title}
    </div>
  )
}

export default Title
